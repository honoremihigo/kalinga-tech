import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LostPropertyStatus } from 'generated/prisma';
import { MailService } from 'src/Global/Messages/email/mail.service';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class LostPropertiesService {
  constructor(private prisma: PrismaService, private mailService:MailService) {}

  async create(data: {
    itemName: string;
    itemDescription: string;
    bokingNumber?: string;
    claimantEmail?: string;
    claimantPhone?:string;
  }) {
    return this.prisma.lostProperties.create({ data });
  }

  async findAll() {
    return this.prisma.lostProperties.findMany({
      include: {
        booking: {
          include: {
            client: true,
            driver: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.lostProperties.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Lost property not found');
    return item;
  }

  async update(
    id: string,
    data: Partial<{
      itemName: string;
      itemDescription: string;
      bokingNumber?: string;
      claimantEmail?:string;
      claimantPhone?:string;
      returnerName?: string;
      returnerPhone?: string;
      returnerEmail?: string;
      status?: LostPropertyStatus;
    }>,
  ) {
    const exists = await this.prisma.lostProperties.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Lost property not found');

    return this.prisma.lostProperties.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.lostProperties.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Lost property not found');

    return this.prisma.lostProperties.delete({ where: { id } });
  }

  // lost-property.service.ts

  async markAsFound(
    id: string,
    data: {
      returnerName: string;
      returnerPhone: string;
      returnerEmail: string;
      returnerDescription: string;
    },
  ) {
    const property = await this.prisma.lostProperties.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Lost property not found');
    }

    if (property.status === 'found') {
      throw new BadRequestException(
        'This item has already been marked as found',
      );
    }

    const updated = await this.prisma.lostProperties.update({
      where: { id },
      data: {
        returnerName: data.returnerName,
        returnerPhone: data.returnerPhone,
        returnerEmail: data.returnerEmail,
        returnerDescription: data.returnerDescription,
        status: 'found',
      },
    });

    await this.mailService.sendEmail(String(property.claimantEmail), 'Your Lost Property Has Been Found!',`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lost Property Found</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">🎉 Good News!</h2>
    <p>Dear <strong>${property.claimantEmail}</strong>,</p>
    <p>We're happy to inform you that the property you reported as lost has been verified to belong to you and is now marked as <strong>returned</strong>.</p>
    <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.returnerDescription}</td>
      </tr>
    </table>
    <p>Thank you for your patience and for using our Lost and Found service.</p>
    <p style="margin-top: 30px;">Best regards,<br><em>Lost & Found Team</em></p>
  </div>
</body>
</html>
`,)
    return {
      message: 'Lost property marked as found',
      data: updated,
    };
  }
}
