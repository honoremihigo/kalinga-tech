import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwTAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Read token from cookie, not header
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded; // Inject user into request object
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
