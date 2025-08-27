import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService } from 'src/Global/Messages/email/email.service';

@Injectable()
export class DriverService {
  emailService: EmailService;
  constructor(private prisma: PrismaService) {
    this.emailService = new EmailService();
  }
// driver.service.ts

async create(data: any) {

    console.log('Saving driver data:', data);  // <--- check if file paths are present here

  // Convert date fields
  ['dateOfBirth', 'licenseExpiryDate', 'availabilityToStart'].forEach((field) => {
    if (data[field]) {
      const date = new Date(data[field]);
      if (!isNaN(date.getTime())) {
        data[field] = date;
      } else {
        delete data[field]; // or handle the error
      }
    }
  });

  // Convert numeric fields
  if (data.yearsOfExperience) {
    const parsed = parseInt(data.yearsOfExperience, 10);
    if (!isNaN(parsed)) {
      data.yearsOfExperience = parsed;
    } else {
      delete data.yearsOfExperience; // or handle appropriately
    }
  }

  return this.prisma.driver.create({ data });
}


  async updateStatus(id: number, status: string) {
    const driver = await this.prisma.driver.update({
      where: { id },
      data: { Status: status },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    // Fetch assigned vehicle
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { ownerId: id },
    });

    // Send email only if status is "Approved"
    if (status.toLowerCase() === 'approved') {
     await this.emailService.sendEmail(
  driver.email,
  'Welcome to Abyride! Your Account is Approved',
  'driver-application-approved',
  {
    // Contract details
    contractId: 'ABC123', // You need to get this from somewhere
    contractStartDate: new Date().toLocaleDateString(),
    serviceDate: '2023-12-25', // Example
    serviceTime: '10:00 AM',
    serviceLocation: 'Grand Rapids, MI',
    
    // Driver details
    firstName: driver.firstName,
    lastName: driver.lastName,
    dateOfBirth: driver.dateOfBirth?.toLocaleDateString() || 'Not provided',
    gender: driver.gender || 'Not provided',
    nationality: driver.nationality || 'Not provided',
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    address: driver.address || 'Not provided',
    emergencyContactName: driver.emergencyContactName || 'Not provided',
    emergencyContactNumber: driver.emergencyContactNumber || 'Not provided',
    
    // Vehicle details
    vinNumber: vehicle?.vinNumber || 'Not provided',
    make: vehicle?.make || 'Not provided',
    model: vehicle?.model || 'Not provided',
    year: vehicle?.year || 'Not provided',
    plateNumber: vehicle?.plateNumber || 'Not provided',
    color: vehicle?.color || 'Not provided',
    category: vehicle?.category || 'Not provided',
    registrationState: vehicle?.registrationState || 'Not provided',
    registrationDate: vehicle?.registrationDate?.toLocaleDateString() || 'Not provided',
    expiryDate: vehicle?.expiryDate?.toLocaleDateString() || 'Not provided',
    insuranceNumber: vehicle?.insuranceNumber || 'Not provided',
    insuranceCompany: vehicle?.insuranceCompany || 'Not provided',
    insuranceExpiry: vehicle?.insuranceExpiry?.toLocaleDateString() || 'Not provided',
    numberOfDoors: vehicle?.numberOfDoors || 'Not provided',
    seatingCapacity: vehicle?.seatingCapacity || 'Not provided',
    
    logoUrl: process.env.ABYRIDE_LOGO_URL,
    appDownloadLink: process.env.ABYRIDE_APP_LINK,
  },

      );
    }

    return { message: 'Driver status updated successfully', driver };
  }





  async findAll() {
    return this.prisma.driver.findMany({
      include:{
        feeCategory:true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.driver.findUnique({ where: { id } });
  }



  async update(id: number, data: any) {
  // Normalize dates
  ['dateOfBirth', 'licenseExpiryDate', 'availabilityToStart'].forEach((field) => {
    if (data[field]) {
      const date = new Date(data[field]);
      if (!isNaN(date.getTime())) {
        data[field] = date;
      } else {
        delete data[field];
      }
    }
  });

  // Normalize numeric fields
  if (data.yearsOfExperience) {
    const parsed = parseInt(data.yearsOfExperience, 10);
    if (!isNaN(parsed)) {
      data.yearsOfExperience = parsed;
    } else {
      delete data.yearsOfExperience;
    }
  }

  // If controller did not strip file paths, do it here (optional fallback):
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string' && data[key].startsWith('uploads\\')) {
      const parts = data[key].split(/[/\\]/); // handles both '/' and '\\'
      data[key] = parts[parts.length - 1];
    }
  });

  return this.prisma.driver.update({ where: { id }, data });
}

  async remove(id: number) {
    // Step 1: Find the driver record first
    const driver = await this.prisma.driver.findUnique({ where: { id } });

    if (!driver) throw new Error('Driver not found');

    // Step 2: List the fields that may contain uploaded file names
    const fileFields = [
      'nationalIdOrPassport',
      'policeClearanceCertificate',
      'proofOfAddress',
      'drivingCertificate',
      'workPermitOrVisa',
      'drugTestReport',
      'employmentReferenceLetter',
      'bankStatementFile',
    ];

    // Step 3: Delete each file if it exists
    fileFields.forEach((field) => {
      const filename = driver[field];
      if (filename) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Step 4: Remove the driver from the DB
    return this.prisma.driver.delete({ where: { id } });
  }


}
