import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';

import { CreateUsageDto } from './dto/create-usage.dto';

import { UsageService } from './usage.service';

import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('usage')
export class UsageController {
  constructor(private usageService: UsageService) {}

  @Get()
  @UseGuards(JwtGuard)
  getUsage(@Req() req: any) {
    return this.usageService.getUsage(req.user.userId);
  }
  @Post('log')
  @UseGuards(JwtGuard)
  createUsage(@Req() req: any, @Body() dto: CreateUsageDto) {
    return this.usageService.createUsage(req.user.userId, dto);
  }
  @Get('check')
  @UseGuards(JwtGuard)
  checkLimit(@Req() req: any) {
    return this.usageService.checkLimit(req.user.userId);
  }
}
