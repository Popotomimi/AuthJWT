import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'https://authjwt-aqoe.onrender.com/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.githubRegister({ email, name });
    }

    if (!user) {
      throw new Error('Erro ao obter usuário após criação.');
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }
}
