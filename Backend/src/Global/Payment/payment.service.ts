import { Injectable } from '@nestjs/common';
import { StripePaymentServices } from './stripe-payment.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripePaymentServices,
  ) {}

  async createStripeSession(data: {
    amount: number;
    email: string;
    pickup: string;
    dropoff: string;
    reservationId: string; // Reservation ID to track payment
  }): Promise<Stripe.Checkout.Session> {
    return this.stripeService.createCheckoutSession(data);
  }

  async retrieveCheckoutSession(paymentSessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripeService.retrieveCheckoutSession(paymentSessionId);
  }

  async createPayPalPayment(data: any): Promise<{ url: string; orderId: string }> {
    // Placeholder for PayPal integration
    return {
      url: 'https://paypal.com/payment-link',
      orderId: 'paypal_order_123',
    };
  }

  async createCashAppPayment(data: any): Promise<{ url: string }> {
    // Placeholder for CashApp integration
    return {
      url: 'https://cash.app/payment-link',
    };
  }
}
