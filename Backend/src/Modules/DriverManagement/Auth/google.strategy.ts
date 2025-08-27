import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from '../../../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../Auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-driver') {
  constructor(
    private readonly driverServices: AuthService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: process.env.DRIVER_CLIENT_ID,
      clientSecret: process.env.DRIVER_CLIENT_SECRET,
      callbackURL: process.env.DRIVER_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true, // important if you want to set cookie manually later
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function, // we're bypassing the redirect mechanism here
  ): Promise<any> {
    try {
      const { id: googleId, emails } = profile;
      const userEmail = emails?.[0]?.value;

      if (!userEmail) {
        return done(null, {
          status: 'invalid_token',
          message: 'Google account email not found',
        });
      }

      let driver = await this.driverServices.findDriverByGoogleId(googleId);

      // If not linked via Google, check by email
      if (!driver) {
        driver = await this.driverServices.findOneDriver(userEmail);

        if (!driver) {
          return done(null, { status: 'not_registered' });
        }

        if (driver.Status !== 'approved') {
          return done(null, {
            status: 'unapproved',
            message: `Account status is '${driver.Status}'`,
          });
        }

        // Link Google ID
        driver = await this.prisma.driver.update({
          where: { email: userEmail },
          data: { googleId },
        });
      }

      // Check again even if found via Google
      if (driver.Status !== 'approved') {
        return done(null, {
          status: 'unapproved',
          message: `Account status is '${driver.Status}'`,
        });
      }

      const token = this.jwtService.sign({ id: driver.id });

      // You can optionally set a cookie here if needed:
      if (req?.res) {
        req.res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return done(null, { status: 'ok', driver });
    } catch (error) {
      console.error('Google Strategy Error:', error);
      return done(null, { status: 'error', message: 'Google login failed' });
    }
  }
}
