// src/contact/contact.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/Messages/email/email.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async processContact(data: any) {
    const { fullName, email, phone, subject, message } = data;

    if (!fullName || !email || !phone || !subject || !message) {
      throw new BadRequestException('All fields are required');
    }

    await this.prisma.contactMessage.create({
      data: { fullName, email, phone, subject, message },
    });

    // Send thank-you email to client
    await this.emailService.sendEmail(
      email,
      'Thank you for your feedback!',
      'client-feedback',
      {
        name: fullName,
        subject,
        year: new Date().getFullYear(),
      },
    );

    // Send notification to admin
    await this.emailService.sendEmail(
      process.env.SUPPORT_EMAIL || process.env.SMTP_USERNAME!,
      'New Contact Form Submission',
      'admin-feedback',
      {
        fullName,
        email,
        phone,
        subject,
        message,
        year: new Date().getFullYear(),
      },
    );

    return { success: true, message: 'Thank you for contacting us!' };
  }

   async getAllMessages() {
    return await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

async deleteMessage(id: string) {
  const existing = await this.prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Contact message not found');
  }

  await this.prisma.contactMessage.delete({ where: { id } });
  return { success: true, message: 'Contact message deleted successfully' };
}

}
