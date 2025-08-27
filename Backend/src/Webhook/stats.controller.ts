// stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('counts')
  async getCounts() {
    const [
      foundPropertyCount,
      lostPropertyReportCount,
      contactMessageCount,
      feeCategoryCount,
      vehicleCount,
      driverCount,
      clientCount,
      reservationCount,
    ] = await Promise.all([
      this.prisma.foundProperty.count(),
      this.prisma.lostPropertyReport.count(),
      this.prisma.contactMessage.count(),
      this.prisma.feeCategory.count(),
      this.prisma.vehicle.count(),
      this.prisma.driver.count(),
      this.prisma.client.count(),
      this.prisma.reservation.count(),
    ]);

    return {
      foundPropertyCount,
      lostPropertyReportCount,
      contactMessageCount,
      feeCategoryCount,
      vehicleCount,
      driverCount,
      clientCount,
      reservationCount,
    };
  }
}
