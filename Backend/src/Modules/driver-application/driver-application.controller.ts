// src/driver-application/driver-application.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DriverApplicationService } from './driver-application.service';

@Controller('driver-application')
export class DriverApplicationController {
  constructor(private readonly service: DriverApplicationService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        // Document fields
        { name: 'nationalIdOrPassport', maxCount: 1 },
        { name: 'policeClearanceCertificate', maxCount: 1 },
        { name: 'proofOfAddress', maxCount: 1 },
        { name: 'drivingCertificate', maxCount: 1 },
        { name: 'workPermitOrVisa', maxCount: 1 },
        { name: 'drugTestReport', maxCount: 1 },
        { name: 'employmentReferenceLetter', maxCount: 1 },
        { name: 'bankStatementFile', maxCount: 1 },

        // Vehicle photos
        { name: 'exteriorPhoto1', maxCount: 1 },
        { name: 'exteriorPhoto2', maxCount: 1 },
        { name: 'exteriorPhoto3', maxCount: 1 },
        { name: 'exteriorPhoto4', maxCount: 1 },
        { name: 'interiorPhoto1', maxCount: 1 },
        { name: 'interiorPhoto2', maxCount: 1 },
        { name: 'interiorPhoto3', maxCount: 1 },
        { name: 'interiorPhoto4', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
          },
        }),
      },
    ),
  )
  async submitForm(
    @Body() body: any,
    @UploadedFiles()
    files: { [fieldname: string]: Express.Multer.File[] },
  ) {
    return this.service.processApplication(body, files);
  }
}
