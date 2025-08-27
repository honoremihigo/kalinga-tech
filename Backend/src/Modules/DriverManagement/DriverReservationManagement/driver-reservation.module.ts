import { Module } from '@nestjs/common';
import { DriverReservationService } from './driver-reservation.service';
import { DriverReservationController } from './driver-reservation.controller';
import { PrismaService } from '../../../Prisma/prisma.service'; // Adjust path
import { JwTAuthGuard } from '../Auth/auth.guard'; // Adjust path
import { DriverGateway } from '../driver.gateway';

@Module({
  imports: [],
  controllers: [DriverReservationController],
  providers: [DriverReservationService, PrismaService, JwTAuthGuard],
  exports: [DriverReservationService],  // <-- export service here!
})
export class DriverReservationModule {}
