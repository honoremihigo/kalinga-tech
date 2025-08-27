import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../Prisma/prisma.service'; // Adjust import path accordingly

@Injectable()
export class DriverReservationService {
  constructor(private readonly prisma: PrismaService) {}

// In your ActivityService or similar

async getReservationsByDriverId(driverId: number) {
  // 1. Get all reservation IDs from Activity table (all activities)
  const activities = await this.prisma.activity.findMany({
    select: { reservationId: true },
  });

  // Extract unique reservation IDs
  const reservationIds = [...new Set(activities.map(a => a.reservationId))];

  if (reservationIds.length === 0) {
    return [];
  }

  // 2. Fetch reservation details for these reservation IDs AND matching driverId
  const reservations = await this.prisma.reservation.findMany({
    where: {
      id: { in: reservationIds },
      driverId: driverId,  // filter by logged-in driver's id
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      ReservationNumber: true,
      firstName: true,
      lastName: true,
      pickup: true,
      dropoff: true,
      price: true,
      driverEarningAmount: true,
      Rating: true,
      reservationStatus: true,
      scheduledDateTime: true,
      carCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return reservations;
}


  // Optional: get single reservation by id (if needed)
  async getReservationById(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { carCategory: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async markCompleteByDriver(reservationId: string) {
  return this.prisma.reservation.updateMany({
    where: { id: reservationId},
    data: { reservationStatus: 'Completed' },
  });
}

async getDriverStats(driverId: number) {
  // Total reservations
  const totalReservations = await this.prisma.reservation.count({
    where: { driverId },
  });

  // Assigned reservations
  const assignedCount = await this.prisma.reservation.count({
    where: {
      driverId,
      reservationStatus: 'assigned',
    },
  });

  // Completed reservations
  const completedCount = await this.prisma.reservation.count({
    where: {
      driverId,
      reservationStatus: 'Completed',
    },
  });

  // Total earnings
  const earningSumResult = await this.prisma.reservation.aggregate({
    _sum: {
      driverEarningAmount: true,
    },
    where: { driverId },
  });

  const totalEarnings = earningSumResult._sum.driverEarningAmount || 0;

  // Get driverRatingCount from the Driver table
  const driver = await this.prisma.driver.findUnique({
    where: { id: driverId },
    select: { driverRatingCount: true },
  });

  const driverRatingCount = driver?.driverRatingCount || 0;

  return {
    totalReservations,
    assignedCount,
    completedCount,
    totalEarnings,
    driverRatingCount,
  };
}


async getDriverEarningsSummary(driverId: number) {
  const allReservations = await this.prisma.reservation.findMany({
    where: { driverId },
    select: {
      driverEarningAmount: true,
      reservationStatus: true,
      createdAt: true,
    },
  });

  // Total earnings from completed trips
  const totalEarnings = allReservations.reduce(
    (sum, res) =>
      res.reservationStatus === 'Completed'
        ? sum + (res.driverEarningAmount || 0)
        : sum,
    0,
  );

  // Total earnings from pending (assigned) trips
  const pendingEarnings = allReservations.reduce(
    (sum, res) =>
      res.reservationStatus === 'assigned'
        ? sum + (res.driverEarningAmount || 0)
        : sum,
    0,
  );

  // Define the type for monthly breakdown
  type MonthlyBreakdownItem = {
    month: string;
    completedEarnings: number;
    pendingEarnings: number;
  };

  // Monthly Breakdown: Jan to Dec of current year
  const currentYear = new Date().getFullYear();
  const monthlyBreakdown: MonthlyBreakdownItem[] = [];

  for (let month = 0; month < 12; month++) {
    const start = new Date(currentYear, month, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);

    const monthReservations = allReservations.filter(
      (res) => res.createdAt >= start && res.createdAt <= end
    );

    const completedInMonth = monthReservations
      .filter((r) => r.reservationStatus === 'Completed')
      .reduce((sum, r) => sum + (r.driverEarningAmount || 0), 0);

    const pendingInMonth = monthReservations
      .filter((r) => r.reservationStatus === 'assigned')
      .reduce((sum, r) => sum + (r.driverEarningAmount || 0), 0);

    monthlyBreakdown.push({
      month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
      completedEarnings: completedInMonth,
      pendingEarnings: pendingInMonth,
    });
  }

  const driver = await this.prisma.driver.findUnique({
    where: { id: driverId },
    select: { driverRatingCount: true },
  });

  return {
    totalEarnings,       // earnings from completed trips
    pendingEarnings,     // earnings from assigned (pending) trips
    driverRatingCount: driver?.driverRatingCount || 0,
    monthlyBreakdown,    // Jan to Dec breakdown
  };
}
}
