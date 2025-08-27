// src/lost-property/lost-property.module.ts
import { Module } from '@nestjs/common';
import { LostPropertyService } from './lost-property.service';
import { LostPropertyController } from './lost-property.controller';
import { EmailService } from '../../Global/Messages/email/email.service';  // Adjust path as needed
import { PrismaService } from '../../Prisma/prisma.service'; // Your prisma service

@Module({
  controllers: [LostPropertyController],
  providers: [LostPropertyService, EmailService, PrismaService],
})
export class LostPropertyModule {}
