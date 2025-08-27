// src/driver-application/driver-application.module.ts
import { Module } from '@nestjs/common';
import { DriverApplicationController } from './driver-application.controller';
import { DriverApplicationService } from './driver-application.service';
import { EmailService } from 'src/Global/Messages/email/email.service';


@Module({
  controllers: [DriverApplicationController],
  providers: [DriverApplicationService, EmailService],
})
export class DriverApplicationModule {}
