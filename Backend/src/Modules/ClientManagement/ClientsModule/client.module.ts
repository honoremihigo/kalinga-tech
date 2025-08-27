import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../../../Prisma/prisma.service';
import { ClientAuthController } from '../auth/auth.controller';
import { ClientAuthService } from '../auth/auth.service';
import { JwTAuthGuard } from '../auth/auth.guard';
import { OtpManagementService } from '../../../Global/Otp-management/otp-management.service';
import { EmailService } from '../../../Global/Messages/email/email.service';
import { SmsService } from '../../../Global/Messages/phone/sms.service';
import { clientGoogleStrategy } from '../auth/google.strategy';
import { ClientService } from '../client.service';
import { ClientController } from '../client.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ClientAuthController, ClientController],
  providers: [
    ClientAuthService,
    JwTAuthGuard,
    PrismaService,
    OtpManagementService,
    EmailService,
    SmsService,
    clientGoogleStrategy,
    ClientService
  ],
  exports: [ClientAuthService],
})
export class ClientModule {}