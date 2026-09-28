import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    return subscription;
  }
  async upgradeSubscription(userId: number, plan: string) {
    let limit = 20;

    if (plan === 'PRO') {
      limit = 1000;
    }

    if (plan === 'PREMIUM') {
      limit = 5000;
    }

    const subscription = await this.prisma.subscription.update({
      where: {
        userId,
      },

      data: {
        plan,

        status: 'ACTIVE',

        limit,
      },
    });

    return {
      message: 'Subscription upgraded successfully',
      subscription,
    };
  }
  async cancelSubscription(userId: number) {
    const subscription = await this.prisma.subscription.update({
      where: {
        userId,
      },

      data: {
        status: 'CANCELLED',
      },
    });

    return {
      message: 'Subscription cancelled successfully',

      subscription,
    };
  }
}
