// src/webhooks/webhook.controller.ts

import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ReservationService } from '../Modules/Reservation/reservation.service';
import { StripePaymentServices } from '../Global/Payment/stripe-payment.service';
import Stripe from 'stripe';
import { BookingService } from 'src/Modules/booking-managment/booking.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: StripePaymentServices,
  ) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      this.logger.warn('⚠️ Missing stripe-signature header');
      return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;
    try {
      event = this.paymentService.verifyWebhook(req.body, sig as string);
      this.logger.log(`✅ Stripe Event Received: ${event.type}`);
    } catch (err) {
      this.logger.error(
        `❌ Stripe webhook verification failed: ${(err as Error).message}`,
      );
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    // Only handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        try {
          const bookingId = session.metadata?.bookingId;
          if (!bookingId) {
            throw new Error('Booking ID not found in session metadata');
          }
          // Use the stored paymentSessionId (which is the session.id)
          await this.bookingService.markAsPaidBooking(bookingId);
          this.logger.log('✅ Reservation updated as paid');
        } catch (error) {
          this.logger.error(
            `❌ Failed to update reservation: ${(error as Error).message}`,
          );
          // Still respond 200 so Stripe doesn't retry excessively
          return res.status(200).send('Failed to update reservation');
        }
      }
    }

    // Respond 200 to acknowledge receipt of webhook
    return res.status(200).send('Received');
  }
}
