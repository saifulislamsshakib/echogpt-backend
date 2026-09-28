import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UsageModule } from './usage/usage.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    SubscriptionModule,
    UsageModule,
    ChatModule,
    AiModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
