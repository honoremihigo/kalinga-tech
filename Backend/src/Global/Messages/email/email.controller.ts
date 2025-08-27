import { Controller, Get, Query, Res, Post, Body } from '@nestjs/common';
import { GmailService } from './emailmessage.service';
import { Response } from 'express';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('auth')
  async auth(@Res() res: Response) {
    const url = await this.gmailService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('oauth2callback')
  async oauth2callback(@Query('code') code: string, @Res() res: Response) {
    await this.gmailService.setTokensFromCode(code);
    return res.redirect('http://localhost:3000/Dispatch/dashboard/send-email');
  }

  /**
   * List messages but already processed to include only necessary data
   */
  @Get('messages')
  async listMessages(@Query('label') label: string) {
    const labelId = label?.toUpperCase() || 'INBOX';
    return this.gmailService.listSimplifiedMessages(labelId);
  }

  /**
   * Get a single message with body text included
   */
  @Get('message')
  async getMessage(@Query('id') id: string) {
    if (!id) {
      return { error: 'Message ID is required' };
    }
    return this.gmailService.getSimplifiedMessage(id);
  }

@Post('send')
async sendEmail(@Body() body: any) {
  if (!body) {
    return { error: 'Request body is missing' };
  }

  const { to, subject, message } = body;

  if (!to || !subject || !message) {
    return { error: 'To, subject and message are required' };
  }

  await this.gmailService.sendEmailRaw(to, subject, message);
  return { success: true, message: `Email sent to ${to}` };
}

}
