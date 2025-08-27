// src/modules/reservation/reservation.module.ts
import { Global, Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AddressProcessorModule } from '../../Global/RouteSense/address-processor.module';
import { ReservationController } from './reservation.controller';
import { PricingModule } from 'src/Global/Pricing/pricing.module';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { EmailModule } from 'src/Global/Messages/email/email.module';

import { PaymentModule } from 'src/Global/Payment/payment.module';
import { NotificationModule } from 'src/Global/Messages/phone/sms.module';

@Global()
@Module({
  imports: [
    AddressProcessorModule,
    PricingModule,
    PrismaModule,
    EmailModule,
    PaymentModule,
    NotificationModule, // Ensure SmsService is available globally
  ],  // Import the module here
  providers: [ReservationService],
  exports: [ReservationService],
  controllers:[ReservationController]
})
export class ReservationModule {}
