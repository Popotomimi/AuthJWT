import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

// Callback em DEV: http://localhost:3000/auth/facebook/callback

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
      callbackURL: 'https://authjwt-aqoe.onrender.com/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile?.emails?.[0]?.value;
    const name = profile.displayName;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.facebookRegister({
        email,
        name,
      });
    }

    if (!user) {
      throw new Error('Erro ao obter usuário após criação.');
    }

    const userAdaptado = {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };

    return userAdaptado;
  }
}
