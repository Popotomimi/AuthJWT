import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

// Callback em DEV: http://localhost:3000/auth/google/callback

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'https://authjwt-aqoe.onrender.com/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile?.emails?.[0]?.value;
    const name = profile.displayName;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.register({
        email,
        name,
        password: '',
      });
    }

    if (!user) {
      throw new Error('Erro ao obter usuário após criação.');
    }

    const userAdaptado = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return userAdaptado;
  }
}
