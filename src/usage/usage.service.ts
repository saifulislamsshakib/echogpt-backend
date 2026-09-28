import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async getUsage(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const used = await this.prisma.aPIUsageLog.count({
      where: {
        userId,
      },
    });

    return {
      plan: subscription.plan,

      limit: subscription.limit,

      used,

      remaining: subscription.limit - used,
    };
  }
  async createUsage(
    userId: number,
    data: {
      endpoint: string;
      statusCode: number;
      responseTime: number;
    },
  ) {
    const usage = await this.prisma.aPIUsageLog.create({
      data: {
        userId,

        endpoint: data.endpoint,

        statusCode: data.statusCode,

        responseTime: data.responseTime,
      },
    });

    return {
      message: 'Usage logged successfully',

      usage,
    };
  }
  async checkLimit(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const used = await this.prisma.aPIUsageLog.count({
      where: {
        userId,
      },
    });

    if (used >= subscription.limit) {
      return {
        allowed: false,
        message: 'API usage limit exceeded',
      };
    }

    return {
      allowed: true,
      remaining: subscription.limit - used,
    };
  }
}
