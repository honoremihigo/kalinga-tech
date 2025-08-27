// src/Global/Payment/cashapp-payment.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CashAppPaymentService {
  async createCashAppPayment(data: { amount: number; email: string }) {
    return {
      url: 'https://cash.app/$abyridellc',
      instructions: `Please open Cash App, send $${data.amount.toFixed(2)} to $abyridellc, and include your email (${data.email}) in the note.`,
    };
  }
}

