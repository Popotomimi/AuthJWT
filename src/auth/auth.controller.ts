import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

const createUserToken = require('./create-user-token');

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    // Apenas aciona o guard do Google - sem lógica aqui
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const rawUser = req.user;

    const user = {
      _id: rawUser.id.toString(),
      name: rawUser.name,
      email: rawUser.email,
    };

    const userData = await createUserToken(user);

    const redirectUrl = `https://reactjwt.netlify.app/auth/google/callback?token=${userData.token}&name=${encodeURIComponent(
      user.name,
    )}&email=${encodeURIComponent(user.email)}&id=${userData.id}`;

    return res.redirect(redirectUrl);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req: Request, @Res() res: Response) {
    // Apenas aciona o guard do GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: any, @Res() res: Response) {
    const rawUser = req.user;

    const user = {
      _id: rawUser.id.toString(),
      name: rawUser.name,
      email: rawUser.email,
    };

    const userData = await createUserToken(user);

    const redirectUrl = `https://reactjwt.netlify.app/auth/github/callback?token=${userData.token}&name=${encodeURIComponent(
      user.name,
    )}&email=${encodeURIComponent(user.email)}&id=${userData.id}`;

    return res.redirect(redirectUrl);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: Request, @Res() res: Response) {
    // Aciona o guard
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: any, @Res() res: Response) {
    const rawUser = req.user;

    const user = {
      _id: rawUser.id.toString(),
      name: rawUser.name,
      email: rawUser.email,
    };

    const userData = await createUserToken(user);

    const redirectUrl = `https://reactjwt.netlify.app/auth/facebook/callback?token=${userData.token}&name=${encodeURIComponent(
      user.name,
    )}&email=${encodeURIComponent(user.email)}&id=${userData.id}`;

    return res.redirect(redirectUrl);
  }
}
