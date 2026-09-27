import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  profile(@Req() req: any) {
    return {
      message: 'Profile fetched successfully',
      user: req.user,
    };
  }
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }
  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req: any, @Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
