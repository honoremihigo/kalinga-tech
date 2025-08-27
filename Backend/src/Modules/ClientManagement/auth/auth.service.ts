import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../../Prisma/prisma.service';
import { OtpManagementService } from '../../../Global/Otp-management/otp-management.service';
import { EmailService } from '../../../Global/Messages/email/email.service';
import { SmsService } from '../../../Global/Messages/phone/sms.service';
import { isEmail, isPhone } from '../../../common/Utils/identifier.util';
import { JwtService } from '@nestjs/jwt';
import * as appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class ClientAuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private otpService: OtpManagementService,
    private emailService: EmailService,
    private smsService: SmsService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async createClient(identifier: string) {
    const isEmailType = isEmail(identifier);
    const data: any = {};

    if (isEmailType) {
      data.email = identifier;
    } else {
      data.phoneNumber = identifier;
    }

    return this.prisma.client.create({
      data,
    });
  }

  async requestOtp(value: string) {
    if (!value || (!isEmail(value) && !isPhone(value))) {
      throw new BadRequestException('Enter a valid email or phone number');
    }

    const otp = this.otpService.generateOtp(6);
    await this.otpService.storeOtp(value, otp, 300);

    if (isEmail(value)) {
      await this.emailService.sendEmail(value, 'Your Login OTP', 'Client_otp', { otp });
    } else {
      await this.smsService.sendSMS(value, `Your Abyride client login OTP is: ${otp}`);
    }

    return { message: `OTP sent to ${this.otpService.maskIdentifier(value)}` };
  }

  async verifyOtp(
    value: string,
    otp: string,
    @Res({ passthrough: true }) res: Response,
    deviceInfo?: {
      deviceId: string;
      deviceType: string;
      expoPushToken?: string;
    },
  ) {
    const result = await this.otpService.verifyOtp(value, otp);
    if (!result.success) throw new UnauthorizedException(result.message);

    let client = await this.findOneClient(value);
    let isNewClient = false;

    if (!client) {
      client = await this.createClient(value);
      isNewClient = true;
    }

    const token = this.jwtService.sign({ id: client.id, role: 'client' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    if (deviceInfo?.deviceId) {
      await this.prisma.clientDevice.upsert({
        where: {
          deviceId_clientId: {
            deviceId: deviceInfo.deviceId,
            clientId: client.id,
          },
        },
        update: {
          lastLogin: new Date(),
          isActive: true,
          deviceType: deviceInfo.deviceType,
          expoPushToken: deviceInfo.expoPushToken || undefined,
        },
        create: {
          deviceId: deviceInfo.deviceId,
          clientId: client.id,
          deviceType: deviceInfo.deviceType,
          expoPushToken: deviceInfo.expoPushToken,
        },
      });
    }

    await this.otpService.deleteOtp(value);

    return {
      message: isNewClient ? 'New client created and logged in.' : 'Login successful',
      isNewClient,
      client,
      token,
    };
  }

  async loginWithApple(
    identityToken: string,
    res: Response,
    deviceInfo?: {
      deviceId: string;
      deviceType: string;
      expoPushToken?: string;
    },
  ) {
    let applePayload;
    try {
      const expectedAudience =
        process.env.NODE_ENV === 'production'
          ? 'com.abyride.abyrideclient'
          : 'host.exp.Exponent';

      applePayload = await appleSignin.verifyIdToken(identityToken, {
        audience: expectedAudience,
      });
    } catch (error) {
      return { message: 'Invalid Apple identity token', status: 'invalid_token' };
    }

    if (!applePayload || !applePayload.email) {
      return { message: 'Invalid Apple token payload', status: 'invalid_payload' };
    }

    const client = await this.prisma.client.findUnique({
      where: { email: applePayload.email },
    });

    if (!client) return { message: 'User not registered', status: 'not_registered' };

    const token = this.jwtService.sign({ id: client.id, role: 'client' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (deviceInfo?.deviceId) {
      await this.prisma.clientDevice.upsert({
        where: {
          deviceId_clientId: {
            deviceId: deviceInfo.deviceId,
            clientId: client.id,
          },
        },
        update: {
          lastLogin: new Date(),
          isActive: true,
          deviceType: deviceInfo.deviceType,
          expoPushToken: deviceInfo.expoPushToken || undefined,
        },
        create: {
          deviceId: deviceInfo.deviceId,
          clientId: client.id,
          deviceType: deviceInfo.deviceType,
          expoPushToken: deviceInfo.expoPushToken,
        },
      });
    }

    return { message: 'Login successful', status: 'ok', client };
  }

  async findClientByGoogleId(id: string) {
    return await this.prisma.client.findUnique({ where: { googleId: id } });
  }

  async findOneClient(identifier: string) {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/;
    const isEmailInput = emailRegex.test(identifier);

    return await this.prisma.client.findFirst({
      where: isEmailInput ? { email: identifier } : { phoneNumber: identifier },
    });
  }

  async getProfile(id: number | string) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) throw new BadRequestException('Invalid client id');

    const client = await this.prisma.client.findUnique({ where: { id: numericId } });
    if (!client) throw new UnauthorizedException('Client not found');

    return { client };
  }

  async deleteAccount(id: number | string) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) throw new BadRequestException('Invalid client id');

    await this.prisma.client.delete({ where: { id: numericId } });
    return { message: 'Account deleted' };
  }

  async logout(res: Response) {
    const req = (res as any).req;
    const token = req?.cookies?.token;

    if (!token) {
      res.clearCookie('token');
      return { message: 'Logged out successfully' };
    }

    const payload = this.jwtService.verify(token);
    const clientId = payload?.id;

    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }

  async updateClientLocation(
    clientId: number,
    location: { latitude: number; longitude: number; timestamp: number },
  ) {
    const numericId = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
    if (isNaN(numericId)) throw new BadRequestException('Invalid client id');

    return await this.prisma.client.update({
      where: { id: numericId },
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        lastUpdated: new Date(location.timestamp),
      },
    });
  }

  async completeProfile(clientId: string, data: any) {
    const numericId = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
    if (isNaN(numericId)) throw new BadRequestException('Invalid client id');
    return this.prisma.client.update({
      where: { id: numericId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
    });
  }

  async savePushToken(userId: number, expoPushToken: string) {
    return this.prisma.client.update({
      where: { id: userId },
      data: { expoPushToken },
    });
  }
}
