import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
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

    return users;
  }
  async updateUserRole(userId: number, roleId: number) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        roleId,
      },

      select: {
        id: true,
        name: true,
        email: true,

        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      message: 'User role updated successfully',
      user,
    };
  }
  async deleteUser(userId: number) {
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
      message: 'User deleted successfully',
    };
  }
}
