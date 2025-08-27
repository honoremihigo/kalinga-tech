import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from '../../../Prisma/prisma.service';
import { OtpManagementService } from '../../../Global/Otp-management/otp-management.service';
import { EmailService } from '../../../Global/Messages/email/email.service';
import { SmsService } from '../../../Global/Messages/phone/sms.service';
import { isEmail, isPhone } from '../../../common/Utils/identifier.util';
import { JwtService } from '@nestjs/jwt';
import * as appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';
import { DriverGateway } from '../driver.gateway';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private otpService: OtpManagementService,
    private emailService: EmailService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private driverGateway: DriverGateway,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async requestOtp(value: string) {
    if (!value || (!isEmail(value) && !isPhone(value))) {
      throw new BadRequestException('Enter a valid email or phone number');
    }

    let driver;
    if (isEmail(value)) {
      driver = await this.prisma.driver.findUnique({ where: { email: value } });
    } else {
      driver = await this.prisma.driver.findUnique({ where: { phoneNumber: value } });
    }

    if (!driver) {
      throw new UnauthorizedException('Driver not found. Please register first.');
    }

    if (driver.Status !== 'approved') {
      return {
        message: `Your account status is '${driver.Status}'. Please wait until your account is approved.`,
        status: driver.Status,
      };
    }

    const otp = this.otpService.generateOtp(6);
    await this.otpService.storeOtp(value, otp, 300);

    if (isEmail(value)) {
      await this.emailService.sendEmail(value, 'Your Login OTP', 'Driver_otp', { otp });
    } else {
      await this.smsService.sendSMS(value, `Your Abyride driver login OTP is: ${otp}`);
    }

    return { message: `OTP sent to ${this.otpService.maskIdentifier(value)}` };
  }

  async verifyOtp(value: string, otp: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.otpService.verifyOtp(value, otp);
    if (!result.success) throw new UnauthorizedException(result.message);

    let driver;
    if (isEmail(value)) {
      driver = await this.prisma.driver.findUnique({ where: { email: value } });
    } else {
      driver = await this.prisma.driver.findUnique({ where: { phoneNumber: value } });
    }

    if (!driver) throw new UnauthorizedException('Driver not found. Please register first.');

    const token = this.jwtService.sign({ id: driver.id });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    await this.otpService.deleteOtp(value);

    return { message: 'Login successful', driver };
  }

  async loginWithApple(identityToken: string, res: Response) {
    console.log('Verifying Apple identity token:', identityToken);

    let applePayload;
    try {
      const expectedAudience = process.env.NODE_ENV === 'production'
        ? 'com.abyride.abyridedriver'
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

    const driver = await this.prisma.driver.findUnique({
      where: { email: applePayload.email },
    });

    if (!driver) return { message: 'User not registered', status: 'not_registered' };
    if (driver.Status !== 'approved') {
      return { message: `Account status is '${driver.Status}'. Access denied.`, status: 'unapproved' };
    }

    const token = this.jwtService.sign({ id: driver.id });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful', status: 'ok', driver };
  }


async findDriverByGoogleId(id: string) {
    try {
      return await this.prisma.driver.findUnique({
        where: {
          googleId: id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch driver by Google ID');
    }
  }

async findOneDriver(identifier: string) {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isEmail = emailRegex.test(identifier);

      return await this.prisma.driver.findFirst({
        where: isEmail
          ? { email: identifier }
          : { phoneNumber: identifier },
      });
    } catch (error) {
      console.error('Find one driver error:', error);
      throw new BadRequestException('Failed to fetch driver');
    }
  }


async getProfile(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) throw new BadRequestException('Invalid driver id');

  // Find the driver first
  const driver = await this.prisma.driver.findUnique({ where: { id: numericId } });
  if (!driver) throw new UnauthorizedException('Driver not found');

  // Find vehicle(s) owned by this driver
  const vehicles = await this.prisma.vehicle.findMany({
    where: { ownerId: numericId },
  });

  return { driver, vehicles };
}


  async deleteAccount(id: number | string) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) throw new BadRequestException('Invalid driver id');

    await this.prisma.driver.delete({ where: { id: numericId } });
    return { message: 'Account deleted' };
  }

async logout(res: Response) {
  console.log('logout called');

  // Check if you can get req from res
  console.log('res.req:', (res as any).req);

  // Try to get cookies from res.req
  const req = (res as any).req;
  const token = req?.cookies?.token;

  console.log('token:', token);

  if (!token) {
    console.log('No token found, clearing cookie');
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }

  // Decode token to get driver/user ID
  const payload = this.jwtService.verify(token);
  console.log('payload:', payload);

  const driverId = payload?.id;
  console.log('driverId:', driverId);

  if (driverId) {
    await this.prisma.driver.update({
      where: { id: driverId },
      data: { Availability: 'Offline' },
    });
    console.log('Driver status updated to Offline');
  }

  res.clearCookie('token');
  console.log('Cookie cleared, logout success');

  return { message: 'Logged out successfully' };
}


async updateDriverLocation(
  driverId: number,
  location: { latitude: number; longitude: number; timestamp: number },
  status?: string, // optional status passed, e.g. 'online' or 'offline'
) {
  const numericId = typeof driverId === 'string' ? parseInt(driverId, 10) : driverId;
  if (isNaN(numericId)) throw new BadRequestException('Invalid driver id');

  // Normalize status to lowercase and default to 'offline' if not provided or invalid
  const availability = status?.toLowerCase() === 'online' ? 'Online' : 'Offline';

  return await this.prisma.driver.update({
    where: { id: numericId },
    data: {
      latitude: location.latitude,
      longitude: location.longitude,
      locationUpdatedAt: new Date(location.timestamp),
      Availability: availability,
    },
  });
}

async getDriverStatus(userId: string): Promise<string> {
  const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
  if (isNaN(numericId)) return 'Offline';

  const driver = await this.prisma.driver.findUnique({
    where: { id: numericId },
    select: { Availability: true }, // or whatever field stores status
  });

  return driver?.Availability || 'Offline'; // fallback offline
}

async savePushToken(driverId: number, expoPushToken: string) {
  return this.prisma.driver.update({
    where: { id: driverId },
    data: { expoPushToken },
  });
}


}
