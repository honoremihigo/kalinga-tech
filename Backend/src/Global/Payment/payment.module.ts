// src/Global/Payment/payment.module.ts
import { Module } from '@nestjs/common';
import { StripePaymentServices } from './stripe-payment.service';
import { PayPalPaymentService } from './paypal-payment.service';
import { CashAppPaymentService } from './cashapp-payment.service';
import { PaymentService } from './payment.service';

@Module({
  providers: [
    StripePaymentServices,
    PayPalPaymentService,
    CashAppPaymentService,
    PaymentService,
  ],
  exports: [
    PaymentService,
    StripePaymentServices, // 👈 you're exporting this correctly
  ],
})
export class PaymentModule {}
