import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return user;
  }
  async updateProfile(userId: number, data: { name?: string }) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      message: 'Profile updated successfully',
      user,
    };
  }
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  async deleteAccount(userId: number) {
    await this.prisma.$transaction([
      this.prisma.session.deleteMany({
        where: {
          userId,
        },
      }),

      this.prisma.chatHistory.deleteMany({
        where: {
          userId,
        },
      }),

      this.prisma.webSearch.deleteMany({
        where: {
          userId,
        },
      }),

      this.prisma.aPIUsageLog.deleteMany({
        where: {
          userId,
        },
      }),

      this.prisma.subscription.deleteMany({
        where: {
          userId,
        },
      }),

      this.prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);

    return {
      message: 'Account deleted successfully',
    };
  }
}
