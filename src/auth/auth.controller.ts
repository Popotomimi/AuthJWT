import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
const createUserToken = require('./create-user-token');

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Redireciona para autenticação do Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;

    const userData = await createUserToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      message: `Bem vindo ${user.name}`,
      token: userData.token,
      id: userData.id,
      name: user.name,
    };
  }
}
