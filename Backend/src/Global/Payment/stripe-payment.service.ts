import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../Prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class StripePaymentServices {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil' as any,
    });
  }

  async createCheckoutSession(params: {
    amount: number;
    email: string;
    pickup: string;
    dropoff: string;
    reservationId: string;
  }): Promise<Stripe.Checkout.Session> {
    const { amount, email, pickup, dropoff, reservationId } = params;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ride Reservation',
              description: `Pickup: ${pickup} → Dropoff: ${dropoff}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      payment_intent_data: {},
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      expand: ['payment_intent'],
      metadata: {
        reservationId,
      },
    });
    
    // // ✅ Save the session ID into your DB so webhook can use it
    // await this.prisma.reservation.update({
    //   where: { id: reservationId },
    //   data: { paymentSessionId: session.id },
    // });

    return session;
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  verifyWebhook(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  }
}
