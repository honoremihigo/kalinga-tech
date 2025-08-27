import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from 'generated/prisma';
import { PricingService } from 'src/Global/Pricing/pricing.service';
import { AddressProcessorService } from 'src/Global/RouteSense/address-processor.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Haversine } from 'src/common/Utils/haversineFormula.utils';
import Stripe from 'stripe';

@Injectable()
export class RequestRideManagementService {
  private stripe: Stripe;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly routeSenserServices: AddressProcessorService,
    private readonly priceServices: PricingService,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil' as any,
    });
  }

  async filterDriversByLocation(datas: {
    pickuplat: number;
    pickuplong: number;
    pickupaddress: string;
    dropoffaddress: string;
  }) {
    try {
      const drivers = await this.prismaService.driver.findMany({
        where: {
          Availability: 'online',
          Status: 'approved',
          NOT: {
            feeCategory: null,
          },
        },
        select: {
          id: true,
          firstName: true,
          longitude: true,
          latitude: true,
          feeCategory: true, // Include feeCategory to access fee details
        },
      });
      const driversindb = drivers.map((driver) => {
        return {
          drivername: driver.firstName,
        };
      });
      console.log('drivers', driversindb);
      if (drivers.length === 0) {
        throw new InternalServerErrorException(
          'No drivers available at the moment',
        );
      }
      const radius = 20;
      const nearbyDrivers = drivers.filter((driver) => {
        const distance = Haversine(
          driver.latitude,
          driver.longitude,
          Number(datas.pickuplat),
          Number(datas.pickuplong),
        );
        return distance <= radius;
      });
      const founddrivers = nearbyDrivers.map((driver) => {
        return {
          drivername: driver.firstName,
          id: driver.id,
        };
      });
      console.log('found drivers', founddrivers);
      if (nearbyDrivers.length === 0) {
        throw new InternalServerErrorException(
          'No drivers found within the specified radius',
        );
      }
      const nearbyDriversWithFee = nearbyDrivers
        .filter((driver) => driver.feeCategory !== null)
        .map(async (driver) => {
          const distanceAndDuration =
            await this.routeSenserServices.calculateDistanceAndTraffic(
              datas.pickupaddress,
              datas.dropoffaddress,
            );
          const price = this.priceServices.calculatePrice({
            distanceKm: distanceAndDuration.distance,
            feeCategory: driver.feeCategory!,
          });
          return {
            id: driver.id,
            price: price,
            distance: distanceAndDuration.distance,
            duration: distanceAndDuration.duration,
            name: driver.feeCategory?.name,
            description: driver.feeCategory?.description,
          };
        });
      console.log('searched');
      return Promise.all(nearbyDriversWithFee);
    } catch (error) {
      console.error('Error filtering drivers by location:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async AcceptedDriver(driverId) {
    try {
      const driver = await this.prismaService.driver.findUnique({
        where: {
          id: driverId,
        },
      });
      const vehicle = await this.prismaService.vehicle.findFirst({
        where: {
          ownerId: Number(driverId),
        },
      });
      if (!driver) {
        throw new BadRequestException('driver not found');
      }
      if (!vehicle) {
        throw new BadRequestException('vehicle not found');
      }
      return {
        firstname: driver.firstName,
        lastname: driver.lastName,
        email: driver.email,
        phone: driver.phoneNumber,
        photo: driver.nationalIdOrPassport,
        plate_number: vehicle.plateNumber,
        vehicle_color: vehicle.color,
      };
    } catch (error) {
      console.error('Error filtering drivers by location:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async clientChoseDriver(datas: {
    driverId: number;
    clientId: number;
    price: number;
    pickupaddress: string;
    dropoffaddress: string;
    duration: string;
  }) {
    try {
      console.log('recieved data:', datas.driverId);
      const driver = await this.prismaService.driver.findUnique({
        where: {
          id: datas.driverId,
        },
      });
      if (!driver) {
        throw new InternalServerErrorException('Driver not found');
      }
      if (driver.Status !== 'approved') {
        throw new InternalServerErrorException('Driver is not approved');
      }
      if (driver.Availability?.toLowerCase() !== 'online') {
        throw new InternalServerErrorException(
          'Driver is not available at moment',
        );
      }
      const calculatedPrice = ((60 / 100) * datas.price).toFixed(2);
      const client = await this.prismaService.client.findUnique({
        where: {
          id: datas.clientId,
        },
      });
      return {
        clientId: client?.id,
        clientname: client?.firstName,
        clientEmail: client?.email,
        clientPhone: client?.phoneNumber,
        price: calculatedPrice,
        pickupaddress: datas.pickupaddress,
        dropoffaddress: datas.dropoffaddress,
        duration: datas.duration,
        driverId: datas.driverId,
      };
    } catch (error) {
      console.error('Error in clientChoseDriver:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async rideConfirmed(rideData: {
    clientId?;
    driverId?;
    price?;
    date?;
    pickupAddress?;
    dropoffAddress?;
    pickupLat?;
    pickupLong?;
    dropoffLat?;
    dropoffLong?;
    status?;
    paymentStatus?;
  }) {
    try {
      if (!rideData.clientId) {
        throw new BadRequestException('client id is requred');
      }

      if (!rideData.driverId) {
        throw new BadRequestException('driver id is required');
      }

      const clientExists = await this.prismaService.client.findUnique({
        where: { id: rideData.clientId },
      });

      if (!clientExists) {
        throw new BadRequestException('Client not found');
      }

      const driverExists = await this.prismaService.driver.findUnique({
        where: { id: rideData.driverId },
      });

      if (!driverExists) {
        throw new BadRequestException('Driver not found');
      }

      const ride = await this.prismaService.ride.create({
        data: {
          // clientId: rideData.clientId,
          // driverId: rideData.driverId,
          price: rideData.price,
          date: rideData.date,
          pickupAddress: rideData.pickupAddress,
          dropoffAddress: rideData.dropoffAddress,
          pickupLat: rideData.pickupLat,
          pickupLong: rideData.pickupLong,
          dropoffLat: rideData.dropoffLat,
          dropoffLong: rideData.dropoffLong,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          client: {
            connect: {
              id: rideData.clientId,
            },
          },
          driver: {
            connect: {
              id: rideData.driverId,
            },
          },
        },
      });
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(rideData.price * 100),
        currency: 'usd',
        description: `Ride from ${rideData.pickupAddress} to ${rideData.dropoffAddress}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        rideId: ride.id,
      };
    } catch (error) {
      console.log('error confirming ride:', error);
      throw new Error(error.message);
    }
  }

  async retrievePaymentIntents(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      // Check if payment was successful
      const isPaid = paymentIntent.status === 'succeeded';
      const isProcessing = ['processing', 'requires_action'].includes(
        paymentIntent.status,
      );
      const requiresAction = paymentIntent.status === 'requires_action';
      return {
        paymentIntent,
        isPaid,
        isProcessing,
        requiresAction,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.log('Error retrieving payment intent:', error);
      throw error;
    }
  }

  async paymentConfirmed(data: { paymentIntentId; rideId }) {
    try {
      const paymentIntent = await this.retrievePaymentIntents(
        data.paymentIntentId,
      );

      const ride = await this.prismaService.ride.findUnique({
        where: {
          id: data.rideId,
        },
      });

      if (!ride) {
        throw new NotFoundException('ride not found');
      }

      if (paymentIntent.requiresAction) {
        throw new BadRequestException('payment require customer interaction');
      }

      if (paymentIntent.isProcessing) {
        throw new BadRequestException('Payment is being processed');
      }

      if (paymentIntent.status === 'canceled') {
        throw new BadRequestException('Payment was canceled');
      }

      if (paymentIntent.isPaid) {
        const rideUpdated = await this.prismaService.ride.update({
          where: {
            id: data.rideId,
          },
          data: {
            paymentStatus: 'PAID',
          },
        });
        return rideUpdated;
      }
      return {
        messsage: 'ride payment was successful',
        status: paymentIntent.status,
      };
    } catch (error) {
      console.log('error confirming ride:', error);
      throw new Error(error.message);
    }
  }

  async findAnotherDriver(pickuplat, pickuplong, rejectedDrivers: Set<string>) {
    try {
      const drivers = await this.prismaService.driver.findMany({
        where: {
          Availability: 'online',
          Status: 'approved',
          NOT: {
            feeCategory: null,
          },
        },
        select: {
          id: true,
          firstName: true,
          longitude: true,
          latitude: true,
          feeCategory: true,
        },
      });

      if (drivers.length === 0) {
        throw new InternalServerErrorException(
          'No drivers available at the moment',
        );
      }

      const radius = 20;

      // Step 1: Nearby + Not Rejected
      const filteredDrivers = drivers
        .filter((driver) => !rejectedDrivers.has(String(driver.id))) // not rejected
        .map((driver) => {
          const distance = Haversine(
            driver.latitude,
            driver.longitude,
            Number(pickuplat),
            Number(pickuplong),
          );
          return { ...driver, distance };
        })
        .filter((driver) => driver.distance <= radius); // within range

      if (filteredDrivers.length === 0) {
        throw new InternalServerErrorException('No nearby drivers available');
      }

      // Step 2: Choose one driver (e.g. nearest)
      const chosenDriver = filteredDrivers.sort(
        (a, b) => a.distance - b.distance,
      )[0];

      return chosenDriver;
    } catch (error) {
      console.log('Error finding another driver:', error);
      throw new Error(error.message);
    }
  }
}
