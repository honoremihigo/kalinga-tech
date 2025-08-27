import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ClientAuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwTAuthGuard } from './auth.guard';

@Controller('client/auth')
export class ClientAuthController {
  constructor(private authService: ClientAuthService) {}

  @Post('login')
  requestOtp(@Body('value') value: string) {
    return this.authService.requestOtp(value);
  }

  @Post('verify')
  verifyOtp(
    @Body('value') value: string,
    @Body('otp') otp: string,
    @Body('deviceInfo') deviceInfo: {
      deviceId: string;
      deviceType: string;
      expoPushToken?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(value, otp, res, deviceInfo);
  }

  @Post('apple-login')
  async appleLogin(
    @Body('token') token: string,
    @Body('deviceInfo') deviceInfo: {
      deviceId: string;
      deviceType: string;
      expoPushToken?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginWithApple(token, res, deviceInfo);
  }

  @Get('google')
  @UseGuards(AuthGuard('google-client'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google-client'))
  googleRedirect(@Req() req, @Res() res: Response) {
    const { token } = req.user;

    if (token) {
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
      });
    }

    if (req.user && req.user.redirect) {
      return res.redirect(req.user.redirect);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/clientdashboard`);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwTAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request & { user?: any }) {
    return this.authService.getProfile(req.user?.id);
  }

  @UseGuards(JwTAuthGuard)
  @Patch('update-location')
  async updateLocation(
    @Body() body: { latitude: number; longitude: number; timestamp: number },
    @Req() req: Request & { user?: any },
  ) {
    return this.authService.updateClientLocation(req.user?.id, body);
  }

  @UseGuards(JwTAuthGuard)
  @Patch('complete-profile')
  async completeProfile(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email?: string;
      phoneNumber?: string;
    },
    @Req() req: Request & { user?: any },
  ) {
    return this.authService.completeProfile(req.user?.id, body);
  }

  @UseGuards(JwTAuthGuard)
  @Post('save-push-token')
  async savePushToken(
    @Body('expoPushToken') expoPushToken: string,
    @Req() req: Request & { user?: any },
  ) {
    return this.authService.savePushToken(req.user?.id, expoPushToken);
  }
}
