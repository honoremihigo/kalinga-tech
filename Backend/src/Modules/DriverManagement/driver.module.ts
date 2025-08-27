import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { PrismaService } from '../../Prisma/prisma.service';
import { GoogleVisionService } from 'src/common/Utils/googleVisionDetector';
import { AuthController } from './Auth/auth.controller';
import { AuthService } from './Auth/auth.service';
import { OtpManagementService } from '../../Global/Otp-management/otp-management.service';
import { EmailService } from '../../Global/Messages/email/email.service';
import { SmsService } from '../../Global/Messages/phone/sms.service';
import { JwtModule } from '@nestjs/jwt';
import { JwTAuthGuard } from './Auth/auth.guard';
import { DriverReservationModule } from './DriverReservationManagement/driver-reservation.module';
import { DriverReservationController } from './DriverReservationManagement/driver-reservation.controller';
import { GoogleStrategy } from './Auth/google.strategy'; // ✅ Import your strategy here
import { DriverGateway } from './driver.gateway';

@Module({
  controllers: [DriverController, AuthController, DriverReservationController],
  providers: [
    DriverService,
    PrismaService,
    GoogleVisionService,
    AuthService,
    JwTAuthGuard,
    OtpManagementService,
    EmailService,
    DriverGateway,
    SmsService,
    GoogleStrategy, // ✅ Register the strategy here
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    DriverReservationModule,
  ],
})
export class DriverModule {}
