import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  Patch,
  

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwTAuthGuard } from './auth.guard';

@Controller('driver/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  requestOtp(@Body('value') value: string) {
    return this.authService.requestOtp(value);
  }

  @Post('verify')
  verifyOtp(
    @Body('value') value: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(value, otp, res);
  }



  @Post('apple-login')
  async appleLogin(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginWithApple(token, res);
  }


  @Get('google')
  @UseGuards(AuthGuard('google-driver'))
  googleAuth() {}

@Get('google/callback')
@UseGuards(AuthGuard('google-driver'))
googleRedirect(@Req() req, @Res() res: Response) {
  const { token } = req.user;

  if (token) {
  res.cookie('token', token, {
 httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: false,
  sameSite: 'lax'
});

  }

  if (req.user && req.user.redirect) {
    return res.redirect(req.user.redirect);
  }

  console.log('driver auth successfully');
  return res.redirect(`${process.env.FRONTEND_URL}/driverdashboard`);
}









  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwTAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request & { user?: any }) {
    const user = req.user as any;
    return this.authService.getProfile(user.id);
  }

   // Add this method
@UseGuards(JwTAuthGuard)
  @Patch('update-location')
  async updateLocation(
    @Body()
    body: {
      latitude: number;
      longitude: number;
      timestamp: number;
      status?: string;
    },
    @Req() req: Request & { user?: any },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    return this.authService.updateDriverLocation(userId, body, body.status);
  }

  @UseGuards(JwTAuthGuard)
@Get('status')
async getDriverStatus(@Req() req: Request & { user?: any }) {
  const userId = req.user?.id;
  if (!userId) {
    return { statusCode: 401, message: 'Unauthorized' };
  }

  // Assuming you have a method in authService to get status by userId
  const status = await this.authService.getDriverStatus(userId);

  return { status }; // e.g. { status: 'Online' } or { status: 'Offline' }
}
 // Updated savePushToken route:
  @UseGuards(JwTAuthGuard)
  @Post('save-push-token')
  async savePushToken(
    @Body('expoPushToken') expoPushToken: string,
    @Req() req: Request & { user?: any },
  ) {
    const driverId = req.user?.id;
    if (!driverId) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    return this.authService.savePushToken(driverId, expoPushToken);
  }


}
