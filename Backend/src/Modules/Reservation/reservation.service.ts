import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressProcessorService } from '../../Global/RouteSense/address-processor.service';
import { PricingService } from '../../Global/Pricing/pricing.service';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/Messages/email/email.service';
import { SmsService } from '../../Global/Messages/phone/sms.service';
import { PaymentService } from '../../Global/Payment/payment.service';
import { generateReservationNumber } from '../../common/Utils/reservationNumber';
import { parseScheduledDateTime } from '../../common/Utils/dateUtils';
import { getOtherRiderFields } from '../../common/Utils/otherRider';
import { prepareEmailData } from '../../common/Utils/emailData';
import { calculateEarnings } from '../../common/Utils/driverEarnings';
import * as dayjs from 'dayjs';
import { Prisma } from 'generated/prisma';
@Injectable()
export class ReservationService {
  constructor(
    private addressProcessor: AddressProcessorService,
    private pricingService: PricingService,
    private emailService: EmailService,
    private prisma: PrismaService,
    private paymentService: PaymentService,
    private smsService: SmsService,
  ) {}


    private lastCheckedTimestamp: Date = new Date();

  // Method to get new reservations since last check
  async getNewReservations(): Promise<any> {
    const newReservations = await this.prisma.reservation.findMany({
      where: {
        createdAt: {
          gt: this.lastCheckedTimestamp,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Update lastCheckedTimestamp to now
    this.lastCheckedTimestamp = new Date();

    return newReservations;
  }
  
 async handleReservation(reservationData: any) {
  const {
    firstName,
    lastName,
    customerEmail,
    customerPhone,
    pickupAddress,
    dropoffAddress,
    scheduledDateTime,
    numberOfPassengers,
    carCategory,
    paymentMethod,
    riderType,
    otherRiderData,
  } = reservationData;

  const reservationNumber = generateReservationNumber(firstName, lastName);
  const scheduledDate = parseScheduledDateTime(scheduledDateTime);
  const otherRider = getOtherRiderFields(riderType, otherRiderData);

  const distanceData = await this.addressProcessor.calculateDistanceAndTraffic(
    pickupAddress,
    dropoffAddress,
  );

  const { price } = await this.pricingService.getTotalPrice({
    carCategoryId: Number(carCategory),
    distanceKm: distanceData.distance,
    numberOfPassengers: Number(numberOfPassengers),
  });

  // Calculate earnings breakdown
  const { driverEarning, abyrideEarning } = calculateEarnings(price, 0.6);

  const reservation = await this.prisma.reservation.create({
    data: {
      ReservationNumber: reservationNumber,
      firstName,
      lastName,
      email: customerEmail,
      phoneNumber: customerPhone,
      pickup: pickupAddress,
      dropoff: dropoffAddress,
      scheduledDateTime: scheduledDate || new Date(),
      numberOfPassengers,
      distance: distanceData.distance,
      duration: distanceData.duration,
      price,                    // total price paid by rider
      driverEarningAmount: driverEarning,
      abyrideEarningAmount: abyrideEarning,
      paymentStatus: 'initiated',
      paymentUrl: '',
      paymentSessionId: '',
      paymentIntentId: '',
      carCategoryId: Number(carCategory),
      paymentMethod,
      riderType,
      otherRiderFirstName: otherRider.firstName,
      otherRiderLastName: otherRider.lastName,
      otherRiderEmail: otherRider.email,
      otherRiderPhone: otherRider.phone,
    },
  });

  const clientEmailData = prepareEmailData(reservation, true);
  const driverEmailData = prepareEmailData(reservation, false);

  await this.emailService.sendEmail(
    customerEmail,
    'Your AbyRide Reservation Confirmation',
    'client-reservation-received',
    clientEmailData
  );

  await this.emailService.sendEmail(
    'abyridellc@gmail.com',
    'New Reservation Alert - AbyRide',
    'admin-reservation-received',
    driverEmailData
  );

  return {
    success: true,
    message: 'Reservation created successfully',
    data: {
      ...distanceData,
      price,
      reservationId: reservation.id,
      paymentUrl: '',
      reservationNumber: reservation.ReservationNumber,
      driverEarning,
      abyrideEarning,
    },
  };
}



async sendExpoPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: any = {}
) {
  if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) {
    console.warn('Invalid Expo Push Token:', expoPushToken);
    return;
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      }),
    });

    const result = await response.json();
    console.log('📨 Expo push response:', JSON.stringify(result, null, 2));

    if (!response.ok || result?.data?.status !== 'ok') {
      console.error('❌ Push notification failed:', result);
    } else {
      console.log('✅ Push notification sent successfully to', expoPushToken);
    }
  } catch (error) {
    console.error('🚨 Error sending push notification:', error);
  }
}


async confirmReservation(reservationId: string, driverId: string) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  const {
    price,
    email,
    phoneNumber,
    pickup,
    dropoff,
    paymentMethod,
    ReservationNumber,
  } = reservation;

  if (!price || !email || !phoneNumber) {
    throw new BadRequestException('Incomplete reservation data');
  }

  const paymentHandlers = {
    card: async () => {
      const session = await this.paymentService.createStripeSession({
        amount: price,
        email,
        pickup,
        dropoff,
        reservationId,
      });

      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      return {
        url: session.url,
        sessionId: session.id,
        intentId: paymentIntentId,
        status: 'pending',
        note: null,
      };
    },

    paypal: async () => {
      const payment = await this.paymentService.createPayPalPayment({
        amount: price,
        email,
        pickup,
        dropoff,
      });

      return {
        url: payment.url,
        sessionId: payment.orderId,
        intentId: null,
        status: 'pending',
        note: null,
      };
    },

    'cash app': async () => ({
      url: null,
      sessionId: null,
      intentId: null,
      status: 'pending',
      note: `Please send $${price.toFixed(2)} to $abyridellc via Cash App and include your email (${email}) in the note.`,
    }),

    cash: async () => ({
      url: null,
      sessionId: null,
      intentId: null,
      status: 'not_required',
      note: `Please bring $${price.toFixed(2)} in cash to your scheduled ride. Thank you!`,
    }),
  };

  const method = (paymentMethod || '').toLowerCase().trim();
  if (!(method in paymentHandlers)) {
    throw new NotFoundException(`Unsupported payment method: ${paymentMethod}`);
  }

  const {
    url: paymentUrl,
    sessionId: paymentSessionId,
    intentId: paymentIntentId,
    status: paymentStatus,
    note: paymentNote,
  } = await paymentHandlers[method]();

  // Calculate earnings
  const driverEarningAmount = Number((price * 0.8).toFixed(2)); // 80%
  const abyrideEarningAmount = Number((price * 0.2).toFixed(2)); // 20%

  // Update reservation
  await this.prisma.reservation.update({
    where: { id: reservationId },
    data: {
      driverId: Number(driverId),
      reservationStatus: 'assigned',
      paymentUrl: paymentUrl ?? '',
      paymentSessionId: paymentSessionId ?? '',
      paymentIntentId: paymentIntentId ?? '',
      paymentStatus,
      driverEarningAmount,
      abyrideEarningAmount,
    },
  });

  // Create Activity record
  await this.prisma.activity.create({
    data: {
      reservationId,
    },
  });

  // Fetch driver
  const driver = await this.prisma.driver.findUnique({
    where: { id: Number(driverId) },
  });

  // Send push notification to driver
  if (driver?.expoPushToken) {
    await this.sendExpoPushNotification(
      driver.expoPushToken,
      'New Reservation Assigned',
      `Trip from ${pickup} to ${dropoff}`,
      { reservationId }
    );
  }

  // Fetch vehicle
  const vehicle = await this.prisma.vehicle.findFirst({
    where: { ownerId: Number(driverId) },
  });

  // Send confirmation email to client
  await this.emailService.sendEmail(
    email,
    'Your AbyRide Reservation Confirmation',
    'client-reservation-confirmation',
    {
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      pickup,
      dropoff,
      scheduledDateTime: reservation.scheduledDateTime?.toLocaleString() ?? 'Not scheduled',
      numberOfPassengers: reservation.numberOfPassengers,
      distance: reservation.distance,
      duration: reservation.duration,
      price: `USD ${price.toFixed(2)}`,
      paymentUrl,
      paymentNote,
      ReservationNumber,
      cancelUrl: `${process.env.FRONTEND_URL}/reservation-canceling/${reservationId}`,

      driverName: `${driver?.firstName} ${driver?.lastName}`,
      driverPhone: driver?.phoneNumber,
      driverRating: driver?.driverRatingCount ?? 'N/A',

      vehicleMake: vehicle?.make ?? 'Not assigned',
      vehicleModel: vehicle?.model ?? '',
      vehicleYear: vehicle?.year ?? '',
      vehiclePlate: vehicle?.plateNumber ?? '',
    }
  );

  // Send driver notification email
  if (driver?.email) {
    await this.emailService.sendEmail(
      driver.email,
      'New Reservation Assigned - AbyRide',
      'driver-reservation-assigned',
      {
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        customerPhone: phoneNumber,
        customerEmail: email,
        pickup,
        dropoff,
        scheduledDateTime: reservation.scheduledDateTime?.toLocaleString() ?? 'Not scheduled',
        numberOfPassengers: reservation.numberOfPassengers,
        distance: reservation.distance,
        duration: reservation.duration,
        price: `USD ${price.toFixed(2)}`,
        reservationId,
        driverEarningAmount,
      }
    );
  }

  // Send SMS to client
  const paymentLinkMessage = paymentUrl
    ? `Your AbyRide payment link: ${paymentUrl}`
    : paymentNote ?? 'Thank you for choosing AbyRide.';

  await this.smsService.sendSMS(phoneNumber, paymentLinkMessage);

  // Return summary
  return {
    success: true,
    message: 'Reservation confirmed and driver assigned successfully',
    data: {
      reservationId,
      driverId,
      paymentUrl,
      paymentStatus,
      paymentNote,
      driver: {
        id: driver?.id,
        name: `${driver?.firstName} ${driver?.lastName}`,
        email: driver?.email,
        phoneNumber: driver?.phoneNumber,
        rating: driver?.driverRatingCount,
      },
      vehicle: vehicle
        ? {
            id: vehicle.id,
            vinNumber: vehicle.vinNumber,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            plateNumber: vehicle.plateNumber,
            category: vehicle.category,
          }
        : null,
      earnings: {
        driverEarningAmount,
        abyrideEarningAmount,
      },
    },
  };
}




















async markReservationPaidBySessionId(sessionId: string): Promise<void> {
  const reservation = await this.prisma.reservation.findFirst({
    where: { paymentSessionId: sessionId },
    include: {
      driver: {
        include: {
          Reservation: true,
        },
      },
    },
  });

  if (!reservation) {
    throw new NotFoundException(`Reservation with session ID ${sessionId} not found`);
  }

  if (reservation.paymentStatus === 'paid') return;

  // 🧾 Generate paymentTransactionNumber
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const paymentTransactionNumber = `ABY-PAY-${randomDigits}`;
  const now = new Date();

  // 💾 Update reservation status to 'paid'
  await this.prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      paymentStatus: 'paid',
      paymentTransactionNumber,
      paymentConfirmedAt: now,
    },
  });

  const driver = reservation.driver;

  // 📦 Fetch car (Vehicle) for driver
  const vehicle = driver
    ? await this.prisma.vehicle.findFirst({
        where: { ownerId: driver.id },
      })
    : null;

  const receiptNumber = `AR-${Date.now()}`;
  const formattedDate = reservation.scheduledDateTime?.toLocaleString() ?? 'Not scheduled';
  const frontendBaseUrl = process.env.FRONTEND_URL;

  // 📧 1. Email to Client
  await this.emailService.sendEmail(
    reservation.email,
    'AbyRide Reservation Payment Confirmation',
    'client-reservation-payment-receipt', // 🔖 HTML email template name
    {
      fullName: `${reservation.firstName} ${reservation.lastName}`,
      phone: reservation.phoneNumber,
      pickup: reservation.pickup,
      dropoff: reservation.dropoff,
      scheduledDateTime: formattedDate,
      numberOfPassengers: reservation.numberOfPassengers,
      distance: reservation.distance,
      duration: reservation.duration,
      price: `USD ${reservation.price.toFixed(2)}`,
      paymentStatus: 'Paid',
      receiptNumber,
      reservationNumber: reservation.ReservationNumber,
      paymentTransactionNumber,

      // Driver Details
      driverName: driver ? `${driver.firstName} ${driver.lastName}` : 'Not assigned yet',
      driverEmail: driver?.email || '',
      driverPhone: driver?.phoneNumber || '',
      driverRating: driver?.driverRatingCount ?? 'N/A',

      // Vehicle Info
      carMake: vehicle?.make ?? 'N/A',
      carModel: vehicle?.model ?? 'N/A',
      carColor: vehicle?.color ?? 'N/A',
      plateNumber: vehicle?.plateNumber ?? 'N/A',

      // 🔗 Useful Links

    
     rateDriverLink: `${frontendBaseUrl}/rate-driver/${reservation.id}`,
    cancelLink: `${frontendBaseUrl}/reservation-canceling/${reservation.id}`,
    lostItemLink: `${frontendBaseUrl}/declare-lost-item/${reservation.id}`,
  }
  );

  // 📧 2. Notify Driver
  if (driver?.email) {
    await this.emailService.sendEmail(
      driver.email,
      'New Assigned Ride',
      'driver_assignment_reservation_confirmation',
      {
        driverName: `${driver.firstName} ${driver.lastName}`,
        clientName: `${reservation.firstName} ${reservation.lastName}`,
        clientPhone: reservation.phoneNumber,
        clientEmail: reservation.email,
        pickup: reservation.pickup,
        dropoff: reservation.dropoff,
        scheduledDateTime: formattedDate,
        passengers: reservation.numberOfPassengers,
        driverEarningAmount: reservation.driverEarningAmount,
        reservationNumber: reservation.ReservationNumber,

      }
    );
  }

  // 📲 2b. Send SMS to Driver
  if (driver?.phoneNumber) {
    const smsBody = `Hello ${driver.firstName}, you've been assigned a ride:\n` +
      `Client: ${reservation.firstName} ${reservation.lastName}\n` +
      `Phone: ${reservation.phoneNumber}\n` +
      `Pickup: ${reservation.pickup}\nDropoff: ${reservation.dropoff}\n` +
      `Time: ${formattedDate}`;
    await this.smsService.sendSMS(driver.phoneNumber, smsBody);
  }

  // 📧 3. Admin Alert
  await this.emailService.sendEmail(
    'abyridellc@gmail.com',
    'New Reservation Paid',
    'admin_reservation_receipt',
    {
      receiptNumber,
      fullName: `${reservation.firstName} ${reservation.lastName}`,
      email: reservation.email,
      phone: reservation.phoneNumber,
      pickup: reservation.pickup,
      dropoff: reservation.dropoff,
      scheduledDateTime: formattedDate,
      numberOfPassengers: reservation.numberOfPassengers,
      distance: reservation.distance,
      duration: reservation.duration,
      price: `USD ${reservation.price.toFixed(2)}`,
      driverAssigned: driver ? `${driver.firstName} ${driver.lastName}` : 'Not assigned',
    }
  );
}



  async getAllReservations() {
    return this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }



async rateDriver(reservationId: string, rating: number): Promise<any> {
  if (rating < 1 || rating > 5) {
    throw new BadRequestException('Rating must be between 1 and 5.');
  }

  const reservation = await this.prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { driver: true },
  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found.');
  }

  const operations: Prisma.PrismaPromise<any>[] = [
    // 1. Update Reservation Rating
    this.prisma.reservation.update({
      where: { id: reservationId },
      data: {
        Rating: rating.toString(),
      },
    }),
  ];

  if (reservation.driverId) {
    // 2. Add rating value to driver's total rating count
    operations.push(
      this.prisma.driver.update({
        where: { id: reservation.driverId },
        data: {
          driverRatingCount: {
            increment: rating, // ✅ Add this rating value to existing count
          },
        },
      })
    );
  }

  await this.prisma.$transaction(operations);

  return { message: 'Rating submitted successfully.' };
}




  async getReservationById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
       include: {
    carCategory: true, // This will include all FeeCategory fields
  },
    });
  }


  async cancelReservation(reservationId: string, reason?: string) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      driver: true,
      carCategory: true,
    },
  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  const updated = await this.prisma.reservation.update({
    where: { id: reservationId },
    data: {
      reservationStatus: 'cancelled',
      cancellationReason: reason || 'No reason provided',
      canceledAt: new Date(),
    },
  });

  const fullName = `${reservation.firstName} ${reservation.lastName}`;
  const formattedDate = reservation.scheduledDateTime
    ? dayjs(reservation.scheduledDateTime).format('MMMM D, YYYY h:mm A')
    : 'N/A';

  // 📧 Send cancellation email to AbyRide admin
  await this.emailService.sendEmail(
    'abyridellc@gmail.com',
    'Reservation Cancelled by Client',
    'admin_reservation_cancelled', // 👈 HBS template filename
    {
      fullName,
      email: reservation.email,
      phone: reservation.phoneNumber,
      pickup: reservation.pickup,
      dropoff: reservation.dropoff,
      scheduledDateTime: formattedDate,
      numberOfPassengers: reservation.numberOfPassengers,
      distance: reservation.distance,
      duration: reservation.duration,
      price: `USD ${reservation.price.toFixed(2)}`,
      reason: reason || 'No reason provided',
    }
  );

  return {
    message: 'Reservation cancelled successfully.',
    reservation: updated,
  };
}




async declareLostItemByReservationId(
  reservationId: string,
  lostItemData: {
    itemCategory: string;
    itemDescription: string;
    approximateValue?: string;
    lostLocation?: string;
    preferredContact: string;
    bestContactTime?: string;
    additionalNotes?: string;
  },
) {
  try {
    // Find reservation by its UUID id
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }

    // Save lost item report with reservation details + lost item data
    return await this.prisma.lostPropertyReport.create({
      data: {
        fullName: `${reservation.firstName} ${reservation.lastName}`,
        phoneNumber: reservation.phoneNumber,
        email: reservation.email || null,
        bookingReference: reservation.ReservationNumber,

        itemCategory: lostItemData.itemCategory,
        itemDescription: lostItemData.itemDescription,
        approximateValue: lostItemData.approximateValue || null,
        lostLocation: lostItemData.lostLocation || null,
        preferredContact: lostItemData.preferredContact,
        bestContactTime: lostItemData.bestContactTime || null,
        additionalNotes: lostItemData.additionalNotes || null,

        status: 'Not found',
      },
    });
  } catch (error) {
    console.error('Error in declareLostItemByReservationId:', error);
    throw error; // rethrow so controller can handle it properly
  }
}

async createFoundItem(data: {
    reservationId?: string;
    itemCategory: string;
    itemDescription: string;
    foundLocation?: string;
    additionalNotes?: string;
  }) {
    return this.prisma.foundProperty.create({
      data: {
        reservationId: data.reservationId,
        itemCategory: data.itemCategory,
        itemDescription: data.itemDescription,
        foundLocation: data.foundLocation,
        additionalNotes: data.additionalNotes,
        status: 'Found',
        foundAt: new Date(),
      },
    });
  }


}
