import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MailService } from 'src/Global/Messages/email/mail.service';
import { BookingGateway } from './booking.gateway';
import { EmailService } from 'src/Global/Messages/email/email.service';
import { StripePaymentServices } from 'src/Global/Payment/stripe-payment.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, MailService, BookingGateway, EmailService, StripePaymentServices],
  exports:[
    BookingService
  ]
})
export class BookingModule {}
