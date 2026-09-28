import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(JwtGuard)
  getSubscription(@Req() req: any) {
    return this.subscriptionService.getSubscription(req.user.userId);
  }
  @Patch('upgrade')
  @UseGuards(JwtGuard)
  upgradeSubscription(@Req() req: any, @Body() dto: UpgradeSubscriptionDto) {
    return this.subscriptionService.upgradeSubscription(
      req.user.userId,
      dto.plan,
    );
  }
  @Patch('cancel')
  @UseGuards(JwtGuard)
  cancelSubscription(@Req() req: any) {
    return this.subscriptionService.cancelSubscription(req.user.userId);
  }
}
