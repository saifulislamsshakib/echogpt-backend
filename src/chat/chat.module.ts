import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],

  controllers: [ChatController],

  providers: [ChatService, PrismaService],
})
export class ChatModule {}
