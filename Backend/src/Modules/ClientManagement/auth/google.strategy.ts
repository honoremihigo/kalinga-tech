import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/Prisma/prisma.service';
import { ClientAuthService } from './auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class clientGoogleStrategy extends PassportStrategy(
  Strategy,
  'google-client',
) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly clientServices: ClientAuthService,
  ) {
    super({
      clientID: process.env.CLIENT_ID ,
      clientSecret: process.env.CLIENT_ID_SECRET,
      callbackURL: process.env.CLIENT_CALLBACK_URL,
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
  ):Promise<any>{
     const { id, emails, name } = profile;
    try {
      const familyName = name?.familyName || '';
      const givenName = name?.givenName || '';
      const clientEmail = emails[0].value;
      let client = await this.clientServices.findClientByGoogleId(id);
      if (!client) {
        client = await this.clientServices.findOneClient(clientEmail);
        if (client) {
          if (!client.googleId) {
            client = await this.prisma.client.update({
              where: {
                email: clientEmail,
              },
              data: {
                googleId: id,
              },
            });
          }
        } else {
          client = await this.prisma.client.create({
            data: {
              googleId: id,
              firstName: familyName,
              lastName: givenName,
              email: clientEmail,
            },
          });
        }
        const token = this.jwtService.sign({ id: client.id});
        done(null, { client, token});
      }
      const token = this.jwtService.sign({ id: client.id});
      done(null, { client, token});
    } catch (error) {
      console.log('error', error);
      done(error, null);
    }
  }
}
