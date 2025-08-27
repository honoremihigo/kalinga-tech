import { Module } from '@nestjs/common';
import { VehicleService } from './Vehicle.service';
import { VehicleController } from './vehicle.controller';
import { PrismaService } from '../../Prisma/prisma.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PrismaService],
})
export class VehicleModule {}
