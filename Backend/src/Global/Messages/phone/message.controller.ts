import { Controller, Post, Body, Get, Param, BadRequestException, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // Send a message (outgoing)
  @Post('send')
  async sendMessage(@Body() body: { to: string; message: string }) {
    const { to, message } = body;

    const result = await this.messageService.sendMessage(to, message);

    return {
      status: 'sent',
      data: result,
    };
  }

  // Receive a message (incoming from webhook)
  // GET /messages?phone=0791813289
  // POST /messages/search
  @Post('sent-message')
  async getMessagesByPhone(@Body('phone') phone: string) {
    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    const messages = await this.messageService.getMessagesForClient(phone);
    return messages;
  }

  @Post('inbox')
async getInboxMessages(@Body('phone') phone?: string) {
  const messages = await this.messageService.fetchClickSendInboxMessages(phone);
  return messages;
}



}
