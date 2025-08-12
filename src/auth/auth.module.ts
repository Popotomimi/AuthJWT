import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, GithubStrategy, FacebookStrategy],
})
export class AuthModule {}
