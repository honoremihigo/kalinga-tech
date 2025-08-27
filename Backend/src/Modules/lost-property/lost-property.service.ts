import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/Messages/email/email.service';

@Injectable()
export class LostPropertyService {
  private readonly logger = new Logger(LostPropertyService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createLostPropertyReport(data: any) {
    const report = await this.prisma.lostPropertyReport.create({ data });

    try {
      await this.emailService.sendEmail(
        data.email,
        'Lost Property Report Received',
        'lost-property-confirmation',
        {
          name: data.fullName,
          subject: 'Declaration of Lost Property Report',
          year: new Date().getFullYear(),
        },
      );
    } catch (error) {
      this.logger.error('Failed to send confirmation email', error);
    }

    return report;
  }

  async getAllReports() {
    return this.prisma.lostPropertyReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllFoundProperties() {
    return this.prisma.foundProperty.findMany({
      orderBy: { foundAt: 'desc' },
    });
  }

  async updateLostProperty(id: number, data: any) {
    const report = await this.prisma.lostPropertyReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Lost property report not found');

    return this.prisma.lostPropertyReport.update({
      where: { id },
      data,
    });
  }

  async deleteLostProperty(id: number) {
    return this.prisma.lostPropertyReport.delete({ where: { id } });
  }

  // Mark lost property as found:
  // - create FoundProperty entry
  // - delete from LostPropertyReport
  async activateLostProperty(id: number) {
    const report = await this.prisma.lostPropertyReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Lost property report not found');

    // Create FoundProperty record
    await this.prisma.foundProperty.create({
      data: {
  
   
        itemCategory: report.itemCategory,
        itemDescription: report.itemDescription,


        additionalNotes: report.additionalNotes,
        status: 'Found',
      },
    });

    // Delete from LostPropertyReport
    await this.prisma.lostPropertyReport.delete({ where: { id } });

    return { message: 'Lost property marked as found and moved to FoundProperty.' };
  }

  async updateFoundProperty(id: number, data: any) {
    const found = await this.prisma.foundProperty.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Found property record not found');

    return this.prisma.foundProperty.update({
      where: { id },
      data,
    });
  }

  async deleteFoundProperty(id: number) {
    return this.prisma.foundProperty.delete({ where: { id } });
  }
}
