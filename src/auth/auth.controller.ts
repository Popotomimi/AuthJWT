import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

const createUserToken = require('./create-user-token');

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    // Esse método é só usado para acionar o guard, não precisa lógica aqui
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user as {
      id: string;
      name: string;
      email: string;
    };

    const userData = await createUserToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const redirectUrl = `https://reactjwt.netlify.app/auth/google/callback?token=${userData.token}&name=${encodeURIComponent(
      user.name,
    )}&email=${encodeURIComponent(user.email)}&id=${userData.id}`;

    return res.redirect(redirectUrl);
  }
}
