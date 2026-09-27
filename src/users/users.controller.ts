import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Body, Patch, Delete } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  profile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }
  @Patch('profile')
  @UseGuards(JwtGuard)
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }
  @Patch('change-password')
  @UseGuards(JwtGuard)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(
      req.user.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
  @Delete('account')
  @UseGuards(JwtGuard)
  deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
