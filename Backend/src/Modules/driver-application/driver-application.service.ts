import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import * as path from 'path';
import { EmailService } from '../../Global/Messages/email/email.service';

@Injectable()
export class DriverApplicationService {
  private readonly logger = new Logger(DriverApplicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async processApplication(body: any, files: { [key: string]: Express.Multer.File[] }) {
    try {
      // 1. Extract DRIVER FIELDS
      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        nationality,
        phoneNumber,
        email,
        address,
        emergencyContactName,
        emergencyContactNumber,
        bankAccountNumber,
        licenseId,
        licenseExpiryDate,
        yearsOfExperience,
        languages,
        previousEmployment,
        availabilityToStart,
        licenseIssuedIn,
      } = body;

      const driver = await this.prisma.driver.create({
        data: {
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          nationality,
          phoneNumber,
          email,
          address,
          emergencyContactName,
          emergencyContactNumber,
          bankAccountNumber,
          licenseId,
          licenseExpiryDate: new Date(licenseExpiryDate),
          yearsOfExperience: parseInt(yearsOfExperience),
          languages,
          previousEmployment,
          availabilityToStart: new Date(availabilityToStart),
          licenseIssuedIn,
          nationalIdOrPassport: this.getFileName(files, 'nationalIdOrPassport'),
          policeClearanceCertificate: this.getFileName(files, 'policeClearanceCertificate'),
          proofOfAddress: this.getFileName(files, 'proofOfAddress'),
          drivingCertificate: this.getFileName(files, 'drivingCertificate'),
          workPermitOrVisa: this.getFileName(files, 'workPermitOrVisa'),
          drugTestReport: this.getFileName(files, 'drugTestReport'),
          employmentReferenceLetter: this.getFileName(files, 'employmentReferenceLetter'),
          bankStatementFile: this.getFileName(files, 'bankStatementFile'),
        },
      });

      // 2. Extract VEHICLE FIELDS
      const {
        vinNumber,
        make,
        model,
        year,
        plateNumber,
        color,
        registrationState,
        registrationDate,
        expiryDate,
        insuranceNumber,
        insuranceCompany,
        insuranceExpiry,
        numberOfDoors,
        seatingCapacity,
        serviceHistory,
        accidentHistory,
      } = body;

      const vehicle = await this.prisma.vehicle.create({
        data: {
          vinNumber,
          make,
          model,
          year,
          plateNumber,
          color,
          registrationState,
          registrationDate: new Date(registrationDate),
          expiryDate: new Date(expiryDate),
          insuranceNumber,
          insuranceCompany,
          insuranceExpiry: new Date(insuranceExpiry),
          numberOfDoors,
          seatingCapacity,
          exteriorPhoto1: this.getFileName(files, 'exteriorPhoto1'),
          exteriorPhoto2: this.getFileName(files, 'exteriorPhoto2'),
          exteriorPhoto3: this.getFileName(files, 'exteriorPhoto3'),
          exteriorPhoto4: this.getFileName(files, 'exteriorPhoto4'),
          interiorPhoto1: this.getFileName(files, 'interiorPhoto1'),
          interiorPhoto2: this.getFileName(files, 'interiorPhoto2'),
          interiorPhoto3: this.getFileName(files, 'interiorPhoto3'),
          interiorPhoto4: this.getFileName(files, 'interiorPhoto4'),
          serviceHistory: serviceHistory ? JSON.parse(JSON.stringify(serviceHistory)) : undefined,
          accidentHistory: accidentHistory ? JSON.parse(JSON.stringify(accidentHistory)) : undefined,
          ownerId: driver.id,
        },
      });

      // ✅ 3. Send confirmation email
      await this.emailService.sendEmail(
        email,
        '🚗 Abyride Driver Application Received',
        'DriverApplicationReceived', // Template name without .hbs
        {
          firstName,
          lastName,
          dateOfBirth,
          phoneNumber,
          email,
          nationality,
          licenseId,
          vinNumber,
          make,
          model,
          year,
          plateNumber,
          applicationDate: new Date().toLocaleDateString('en-US'),
        },
      );

      return {
        message: 'Driver and vehicle saved successfully',
        driver,
        vehicle,
      };
    } catch (error) {
      this.logger.error('Error processing application:', error);
      throw error;
    }
  }

  /**
   * Returns only the file name (not full path) for saving to DB
   * Example: uploads/abc-123.jpg → abc-123.jpg
   */
  private getFileName(files: { [key: string]: Express.Multer.File[] }, field: string): string | null {
    const fullPath = files?.[field]?.[0]?.path;
    if (!fullPath) return null;

    const fileName = path.basename(fullPath);
    this.logger.log(`Extracted file name for "${field}": ${fileName}`);
    return fileName;
  }
}
