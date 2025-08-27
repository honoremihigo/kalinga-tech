import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { generateBookingNumber } from 'src/common/Utils/generatebookingnumber.utils';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { MailService } from 'src/Global/Messages/email/mail.service';
import { EmailService } from 'src/Global/Messages/email/email.service';
import { StripePaymentServices } from 'src/Global/Payment/stripe-payment.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly stripe: StripePaymentServices,
  ) {}

  async createBooking(data: any) {
    // STEP 1: Create Client
    let client = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
      },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      });
    }

    // STEP 2: Fetch Driver (if provided)
    let driver;
    if (data.driverId) {
      driver = await this.prisma.driver.findUnique({
        where: { id: data.driverId },
      });
      if (!driver) throw new BadRequestException('Invalid driver ID');
    }

    // STEP 3: Calculate earnings
    let driverEarningAmount = new Decimal(0);
    let abyrideEarningAmount = new Decimal(0);

    const tripPrice = new Decimal(data.price || 0); // only the trip fare
    const parking = new Decimal(data.extraCharge || 0);
    const waiting = new Decimal(data.driverWaitingCharge || 0);

    if (driver) {
      switch (driver.driverType?.toLowerCase()) {
        case 'on wage':
          driverEarningAmount = parking.plus(waiting);
          abyrideEarningAmount = tripPrice; // company keeps full trip price
          break;
        case 'on rent':
          const rentShare = tripPrice.mul(0.4);
          driverEarningAmount = rentShare.plus(parking).plus(waiting);
          abyrideEarningAmount = tripPrice.minus(rentShare);
          break;
        case 'on commission':
          const commissionShare = tripPrice.mul(0.6);
          driverEarningAmount = commissionShare.plus(parking).plus(waiting);
          abyrideEarningAmount = tripPrice.minus(commissionShare);
          break;
        default:
          throw new BadRequestException('Unknown driver type');
      }
    } else {
      abyrideEarningAmount = tripPrice; // no driver yet, company keeps all
    }

    const bookingNumber = generateBookingNumber();

    // STEP 4: Create Booking
    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber: bookingNumber,
        clientId: client.id,
        driverId: driver?.id || null,
        pickupAddress: data.pickupAddress,
        pickupNote: data.pickupNote,
        dropoffAddress: data.dropoffAddress,
        dropoffNote: data.dropoffNote,
        distance: data.distance,
        duration: data.duration,
        rideCategory: data.rideCategory,
        date: new Date(data.date),
        price: tripPrice,
        extraCharge: parking,
        driverPackageCharge: data.driverPackageCharge || null,
        driverWaitingCharge: waiting,
        waitingMin: data.waitingMin,
        driverEarningAmount,
        abyrideEarningAmount,
        luggageCount: data.luggageCount || 0,
        paymentMethod: data.paymentMethod || null,
        paymentStatus: data.paymentStatus || 'PENDING',
        paymentSessionId: data.paymentSessionId || null,
        paymentIntentId: data.paymentIntentId || null,
        paymentConfirmedAt: data.paymentConfirmedAt || null,
        bookingStatus: data.bookingStatus || 'ACCEPTED',
        rating: data.rating || '0',
        canceledAt: data.canceledAt || null,
        rideCompletedAt: data.rideCompletedAt || null,
      },
    });

    // STEP 5: Create Return Trips if provided
    if (data.returnTrips && Array.isArray(data.returnTrips)) {
      for (const trip of data.returnTrips) {
        await this.prisma.bookingReturn.create({
          data: {
            bookingId: booking.id,
            returnDate: new Date(trip.returnDate),
            pickupAddress: trip.pickupAddress,
            dropoffAddress: trip.dropoffAddress,
            pickupNote: trip.pickupNote,
            dropoffNote: trip.dropoffNote,
            distance: trip.distance,
            duration: trip.duration,
          },
        });
      }
    }

    let paymentUrl;
    if (booking.paymentMethod === 'CREDITCARD') {
      const session = await this.stripe.createCheckoutSession({
        amount: Number(booking.price) * 100, // cents
        email: String(client.email),
        pickup: String(booking.pickupAddress),
        dropoff: String(booking.dropoffAddress),
        reservationId: booking.id,
      });
      paymentUrl = session.url;
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { ownerId: data.driverId },
    });

    if (!vehicle) {
      throw new BadRequestException('driver not assigned to any vehicle');
    }
    // send email
    await this.email.sendEmail(
      String(client.email),
      'Your AbyRide Reservation Confirmation',
      'client-reservation-confirmation',
      {
        firstName: client.firstName,
        reservationNumber: booking.bookingNumber,
        pickup: booking.pickupAddress,
        dropoff: booking.dropoffAddress,
        distance: booking.distance,
        price: booking.price,
        duration: booking.duration,
        scheduledDateTime: booking.date,
        driverName: driver.firstname + ' ' + driver.lastName,
        driverPhone: driver.phoneNumber,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehiclePlate: vehicle.plateNumber,
        paymentUrl,
        paymentMethod: 'CREDITCARD', // or "CASH", "MOBILEMONEY", etc.
        showPaymentLink: booking.paymentMethod === 'CREDITCARD', // boolean flag
      },
    );
    await this.email.sendEmail(
      String(driver.email),
      'Your AbyRide Reservation Confirmation',
      'driver-reservation-assigned',
      {
        firstName: driver.firstName,
        lastName: driver.lastName,
        ReservationNumber: booking.bookingNumber,
        pickup: booking.pickupAddress,
        dropoff: booking.dropoffAddress,
        distance: booking.distance,
        price: booking.price,
        duration: booking.duration,
        scheduledDateTime: booking.date,
        customerPhone: client.phoneNumber,
        customerEmail: client.email,
        driverEarningAmount: booking.driverEarningAmount,
      },
    );
    return { message: 'Booking created successfully', data: booking };
  }

  // client booking
  async clientBooking(data: any) {
    // STEP 1: Create Client
    let client = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
      },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      });
    }
    const bookingNumber = generateBookingNumber();

    // STEP 4: Create Booking
    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber: bookingNumber,
        clientId: client.id,
        pickupAddress: data.pickupAddress,
        pickupNote: data.pickupNote,
        dropoffAddress: data.dropoffAddress,
        dropoffNote: data.dropoffNote,
        distance: data.distance,
        duration: data.duration,
        rideCategory: data.rideCategory,
        date: new Date(data.date),
        price: data.price,
        driverPackageCharge: data.driverPackageCharge || null,
        luggageCount: data.luggageCount || 0,
        paymentMethod: data.paymentMethod,
      },
    });

    // STEP 5: Create Return Trips if provided
    if (data.returnTrips && Array.isArray(data.returnTrips)) {
      for (const trip of data.returnTrips) {
        await this.prisma.bookingReturn.create({
          data: {
            bookingId: booking.id,
            returnDate: new Date(trip.returnDate),
            pickupAddress: trip.pickupAddress,
            dropoffAddress: trip.dropoffAddress,
            pickupNote: trip.pickupNote,
            dropoffNote: trip.dropoffNote,
            distance: trip.distance,
            duration: trip.duration,
          },
        });
      }
    }
    await this.email.sendEmail(
      String(client.email),
      'Your AbyRide Reservation Confirmation',
      'client-reservation-received',
      {
        firstName: client.firstName,
        lastName: client.lastName,
        reservationNumber: booking.bookingNumber,
        pickup: booking.pickupAddress,
        dropoff: booking.dropoffAddress,
        distance: booking.distance,
        price: booking.price,
        scheduledDateTime: booking.date,
      },
    );
    return { message: ' client Booking created successfully', data: booking };
  }

  async findAll() {
    try {
      const bookings = await this.prisma.booking.findMany({
        include: {
          client: true,
          driver: true,
          lostProperty: true,
          returnTrips: true,

        },
      });
      
      return { message: 'Bookings retrieved successfully', data: bookings };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUsingBookingnumber(number: string) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { bookingNumber: number },
        include: {
          client: true,
          driver: true,
          lostProperty: true,
          returnTrips: true,
        },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      return { message: 'Booking found', data: booking };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      const updated = await this.prisma.booking.update({
        where: { id },
        data,
      });

      return { message: 'Booking updated', data: updated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.booking.delete({
        where: { id },
      });

      return { message: 'Booking deleted', data: deleted };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async approveBooking(bookingId: string, data: any) {
    try {
      console.log(bookingId, data);

    // STEP 1: Get booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        driver: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.driverId) {
      throw new BadRequestException('Booking already has an assigned driver');
    }

    // STEP 2: Get driver
    const driver = await this.prisma.driver.findUnique({
      where: { id: Number(data.driverId) },
    });
    if (!driver) throw new BadRequestException('Invalid driver ID');

    // STEP 3: Get charges from admin input
    const tripPrice = new Decimal(booking.price || 0);
    const extraCharge = new Decimal(data.extraCharge || 0);
    const parkingFee = new Decimal(data.parkingFee || 0);
    const waitingFee = new Decimal(data.waitingFee || 0);

    // STEP 4: Calculate earnings
    let driverEarningAmount = new Decimal(0);
    let abyrideEarningAmount = new Decimal(0);

    switch (driver.driverType?.toLowerCase()) {
      case 'on wage':
        driverEarningAmount = parkingFee;
        abyrideEarningAmount = tripPrice.plus(waitingFee).plus(extraCharge);
        break;
      case 'on rent':
        driverEarningAmount = tripPrice
          .mul(0.4)
          .plus(parkingFee)
          .plus(waitingFee);
        abyrideEarningAmount = tripPrice
          .minus(tripPrice.mul(0.4))
          .plus(extraCharge);
        break;
      case 'on commission':
        driverEarningAmount = tripPrice
          .mul(0.6)
          .plus(parkingFee)
          .plus(waitingFee);
        abyrideEarningAmount = tripPrice
          .minus(tripPrice.mul(0.6))
          .plus(extraCharge);
        break;
      default:
        throw new BadRequestException('Unknown driver type');
    }

    // STEP 6: Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        driverId: driver.id,
        extraCharge,
        driverPackageCharge: parkingFee,
        driverWaitingCharge: waitingFee,
        waitingMin: String(data.waitingMin),
        driverEarningAmount,
        abyrideEarningAmount,
        bookingStatus: 'ACCEPTED',
      },
    });

    let paymentUrl;
    if (booking.paymentMethod === 'CREDITCARD') {
      const session = await this.stripe.createCheckoutSession({
        amount: Number(booking.price), // cents
        email: String(booking.client.email),
        pickup: String(booking.pickupAddress),
        dropoff: String(booking.dropoffAddress),
        reservationId: booking.id,
      });
      paymentUrl = session.url;
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { ownerId: Number(data.driverId) },
    });

    if (!vehicle) {
      throw new BadRequestException('driver not assigned to any vehicle');
    }

    // send email
    await this.email.sendEmail(
      String(booking.client.email),
      'Your AbyRide Reservation Confirmation',
      'client-reservation-confirmation',
      {
        firstName: booking.client.firstName,
        reservationNumber: booking.bookingNumber,
        pickup: booking.pickupAddress,
        dropoff: booking.dropoffAddress,
        distance: booking.distance,
        price: booking.price,
        duration: booking.duration,
        scheduledDateTime: booking.date,
        driverName: booking.driver
          ? booking.driver.firstName + booking.driver.lastName
          : '',
        driverPhone: driver.phoneNumber,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehiclePlate: vehicle.plateNumber,
        paymentUrl,
        paymentMethod: 'CREDITCARD', // or "CASH", "MOBILEMONEY", etc.
        showPaymentLink: booking.paymentMethod === 'CREDITCARD', // boolean flag
      },
    );
    await this.email.sendEmail(
      String(driver.email),
      'Your AbyRide Reservation Confirmation',
      'driver-reservation-assigned',
      {
        firstName: driver.firstName,
        lastName: driver.lastName,
        ReservationNumber: booking.bookingNumber,
        pickup: booking.pickupAddress,
        dropoff: booking.dropoffAddress,
        distance: booking.distance,
        price: booking.price,
        duration: booking.duration,
        scheduledDateTime: booking.date,
        customerPhone: booking.client.phoneNumber,
        customerEmail: booking.client.email,
        driverEarningAmount: updatedBooking.driverEarningAmount,
      },
    );

    return { message: 'Booking approved successfully', data: updatedBooking };
    } catch (error) {
      console.log('error approving ride:', error.message)
      throw new HttpException(error.message, error.status)
    }
  }

  async rejectBooking(bookingId: string) {
    // 1. Find the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { client: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 2. Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: 'CANCELLED',
        // cancellationReason: data.reason || null,
        canceledAt: new Date(),
      },
      include: {
        client: true,
        driver: true,
      },
    });

    // send email
    await this.email.sendEmail(
      String(updatedBooking.client.email),
      'Your AbyRide Reservation rejected',
      'client-reservation-rejection',
      {
        name:
          updatedBooking.client.firstName +
          ' ' +
          updatedBooking.client.lastName,
        bookingNumber: updatedBooking.bookingNumber,
        pickup: updatedBooking.pickupAddress,
        dropoff: updatedBooking.dropoffAddress,
        distance: updatedBooking.distance,
        price: updatedBooking.price,
        duration: updatedBooking.duration,
        paymentStatus: updatedBooking.paymentStatus,
        scheduledDateTime: updatedBooking.date,
      },
    );

    return { message: 'Booking rejected successfully', data: updatedBooking };
  }

  async markAsPaidBooking(sessionId: string) {
    try {
      if (!sessionId) {
        throw new BadRequestException('session_id is required');
      }

      // 1. Retrieve Stripe session
      const session = await this.stripe.retrieveCheckoutSession(sessionId);

      if (!session) {
        throw new BadRequestException('Stripe session not found');
      }

      // 2. Check payment status
      if (session.payment_status !== 'paid') {
        throw new BadRequestException('Payment not completed yet');
      }

      // 3. Get bookingId from session metadata
      const bookingId = session.metadata?.reservationId;
      if (!bookingId) {
        throw new BadRequestException(
          'Booking ID not found in session metadata',
        );
      }

      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) throw new BadRequestException('booking not found');

      const updatedBooking = await this.prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          paymentStatus: 'PAID',
          paymentConfirmedAt: new Date(),
        },
        include: {
          driver: true,
          client: true,
        },
      });

      const vehicle = await this.prisma.vehicle.findFirst({
        where: { ownerId: Number(updatedBooking.driverId) },
      });

      if (!vehicle) {
        throw new BadRequestException('driver not assigned to any vehicle');
      }
      // send email
      await this.email.sendEmail(
        String(updatedBooking.client.email),
        'Your AbyRide Reservation Confirmation',
        'client-reservation-payment-receipt',
        {
          fullName:
            updatedBooking.client.firstName +
            ' ' +
            updatedBooking.client.lastName,
          reservationNumber: updatedBooking.bookingNumber,
          pickup: updatedBooking.pickupAddress,
          dropoff: updatedBooking.dropoffAddress,
          distance: updatedBooking.distance,
          price: updatedBooking.price,
          duration: updatedBooking.duration,
          paymentStatus: updatedBooking.paymentStatus,
          scheduledDateTime: updatedBooking.date,
          driverName:
            updatedBooking.driver?.firstName +
            ' ' +
            updatedBooking.driver?.lastName,
          driverPhone: updatedBooking.driver?.phoneNumber,
          carMake: vehicle.make,
          carModel: vehicle.model,
          plateNumber: vehicle.plateNumber,
          carColor: vehicle.color,
        },
      );
      await this.email.sendEmail(
        String(updatedBooking.driver?.email),
        'Your AbyRide Reservation Confirmation',
        'driver_assignment_reservation_confirmation',
        {
          driverName: updatedBooking.driver?.firstName,
          clientName:
            updatedBooking.client.firstName +
            ' ' +
            updatedBooking.client.lastName,
          clientPhone: updatedBooking.client.phoneNumber,
          clientEmail: updatedBooking.client.email,
          ReservationNumber: updatedBooking.bookingNumber,
          pickup: updatedBooking.pickupAddress,
          dropoff: updatedBooking.dropoffAddress,
          distance: updatedBooking.distance,
          scheduledDateTime: updatedBooking.date,
          driverEarningAmount: updatedBooking.driverEarningAmount,
        },
      );
      return {
        message: 'paying reservation was success',
        paidBooking: updatedBooking,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
