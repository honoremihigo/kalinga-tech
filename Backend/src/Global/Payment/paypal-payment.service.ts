// src/Global/Payment/paypal-payment.service.ts
import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalPaymentService {
  private environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET,
  );
  private client = new paypal.core.PayPalHttpClient(this.environment);

  async createPayPalPayment(data: {
    amount: number;
    email: string;
    pickup: string;
    dropoff: string;
  }) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: data.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/paypal-success`,
        cancel_url: `${process.env.FRONTEND_URL}/paypal-cancel`,
      },
    });

    const response = await this.client.execute(request);
    const approvalUrl = response.result.links.find(link => link.rel === 'approve')?.href;

    return {
      url: approvalUrl,
      orderId: response.result.id,
    };
  }
}
