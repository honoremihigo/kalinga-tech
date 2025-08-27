import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MailService } from 'src/Global/Messages/email/mail.service';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class FoundPropertiesService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Create a new found property
  async create(data: any) {
    try {
      const property = await this.prisma.foundProperties.create({
        data: {
          ...data,
          driverId: Number(data.driverId),
        },
      });
      return { message: 'Found property created successfully', data: property };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get all found properties
  async findAll() {
    try {
      const properties = await this.prisma.foundProperties.findMany({
        include: { claims: true, approvedClaimant: true, driver: true },
      });
      return {
        message: 'Found properties retrieved successfully',
        data: properties,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get a single found property by ID
  async findOne(id: string) {
    try {
      const property = await this.prisma.foundProperties.findUnique({
        where: { id },
        include: { claims: true, approvedClaimant: true, driver: true },
      });
      if (!property) throw new NotFoundException('Found property not found');
      return {
        message: 'Found property retrieved successfully',
        data: property,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update a found property
  async update(id: string, data: any) {
    try {
      const property = await this.prisma.foundProperties.update({
        where: { id },
        data,
      });
      return { message: 'Found property updated successfully', data: property };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Delete a found property
  async remove(id: string) {
    try {
      await this.prisma.foundProperties.delete({ where: { id } });
      return { message: 'Found property deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async approveFoundProperty(data: {
    foundPropertyId: string;
    claimantId: string;
    name: string;
    email: string;
    phone: string;
    description: string;
  }) {
    try {
      // Validate found property
      const foundProperty = await this.prisma.foundProperties.findUnique({
        where: { id: data.foundPropertyId },
        include: {
          claims:true
        }
      });
      if (!foundProperty)
        throw new NotFoundException('Found property not found');

      // Validate claimant
      const claimant = await this.prisma.claimant.findUnique({
        where: { id: data.claimantId },
      });
      if (!claimant) throw new NotFoundException('Claimant not found');

      // Update property with approved claimant and returner Your Lost Property Has Been Found!i,nfo
      const updated = await this.prisma.foundProperties.update({
        where: { id: data.foundPropertyId },
        data: {
          ownerId: data.claimantId,
          status: 'returned', // or use FoundPropertyStatus.returned
          returnerName: data.name,
          returnerEmail: data.email,
          returnerPhone: data.phone,
          returnerDescription: data.description,
        },
      });

      // Send email to the approved owner
      await this.mailService.sendEmail(
        String(claimant.email),
        'Your Lost Property Has Been Found!',
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lost Property Found</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">🎉 Good News!</h2>
    <p>Dear <strong>${claimant.fullName}</strong>,</p>
    <p>We're happy to inform you that the property you reported as lost has been verified to belong to you and is now marked as <strong>returned</strong>.</p>
    <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.description}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Location Found:</strong></td>
        <td style="padding: 8px;">${foundProperty.locationFound}</td>
      </tr>
    </table>
    <p>Thank you for your patience and for using our Lost and Found service.</p>
    <p style="margin-top: 30px;">Best regards,<br><em>Lost & Found Team</em></p>
  </div>
</body>
</html>
`,
      );


      // Notify other claimants that the property was not theirs
    const rejectedClaimants = foundProperty.claims.filter(
      (c) => c.id !== data.claimantId,
    );

    for (const rejected of rejectedClaimants) {
      await this.mailService.sendEmail(
        String(rejected.email),
        'Lost Property Claim Rejected',
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lost Property Claim Rejected</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #f44336;">⚠️ Claim Rejected</h2>
    <p>Dear <strong>${rejected.fullName}</strong>,</p>
    <p>Thank you for submitting a claim for a found item. After review, we have determined that the item does <strong>not</strong> belong to you.</p>
    <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${foundProperty.itemDescription}</td>
      </tr>
    </table>
    <p>If you believe there has been a mistake, you may contact us with additional proof of ownership.</p>
    <p style="margin-top: 30px;">Best regards,<br><em>Lost & Found Team</em></p>
  </div>
</body>
</html>
`
      );
    }

      return {
        message: 'Found property approved and marked as returned',
        data: updated,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
