import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../../Prisma/prisma.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private readonly apiUrl = 'https://rest.clicksend.com/v3';
  private readonly headers;

  constructor(private prisma: PrismaService) {
    const username = process.env.CLICKSEND_USERNAME;
    const apiKey = process.env.CLICKSEND_API_KEY;

    if (!username || !apiKey) {
      throw new Error('ClickSend credentials missing in .env');
    }

    const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64');
    this.headers = {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  async sendMessage(to, message) {
    const smsPayload = {
      messages: [
        {
          source: 'nodejs',
          from: 'abyride', // Sender ID
          to,
          body: message,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/sms/send`,
        smsPayload,
        { headers: this.headers },
      );

      this.logger.log(`ClickSend response: ${JSON.stringify(response.data)}`);

      await this.prisma.message.create({
        data: {
          from: 'abyride',
          to,
          content: message,
          direction: 'SENT',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error sending SMS via ClickSend');

      if (error.response) {
        this.logger.error(`Status: ${error.response.status}`);
        this.logger.error(`Data: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Headers: ${JSON.stringify(error.response.headers)}`);
      } else {
        this.logger.error(error.message || error.toString());
      }

      throw error;
    }
  }

  async getMessagesForClient(phone) {
    return this.prisma.message.findMany({
      where: {
        OR: [{ from: phone }, { to: phone }],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async fetchClickSendInboxMessages(phoneNumber) {
    try {
 const response: any = await axios.get(`${this.apiUrl}/sms/inbound`, {
  headers: this.headers,
});

const messages = (response.data?.data?.data) || [];

      if (!Array.isArray(messages)) {
        this.logger.error('Invalid message format from ClickSend:', response.data);
        throw new Error('Unexpected response structure from ClickSend');
      }

      if (phoneNumber) {
        return messages.filter(
          (msg) =>
            (msg.from && msg.from.includes(phoneNumber)) ||
            (msg.to && msg.to.includes(phoneNumber))
        );
      }

      return messages;
    } catch (error) {
      this.logger.error('Error fetching inbound messages', error);
      throw new Error('Failed to fetch inbound messages');
    }
  }
}
