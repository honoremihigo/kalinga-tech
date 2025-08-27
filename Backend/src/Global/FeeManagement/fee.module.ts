// fee.module.ts
import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { PrismaService } from '../../Prisma/prisma.service';

@Module({
  controllers: [FeeController],
  providers: [FeeService, PrismaService],
})
export class FeeModule {}