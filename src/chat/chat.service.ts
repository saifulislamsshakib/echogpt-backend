import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}
  async getHistory(userId: number) {
    const chats = await this.prisma.chatHistory.findMany({
      where: {
        userId,
      },

      select: {
        id: true,

        prompt: true,

        response: true,

        provider: {
          select: {
            name: true,
          },
        },

        createdAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return chats;
  }
  async createChat(userId: number, prompt: string) {
    // 1. Check subscription limit

    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    const used = await this.prisma.aPIUsageLog.count({
      where: {
        userId,
      },
    });

    if (used >= subscription.limit) {
      throw new BadRequestException('API usage limit exceeded');
    }

    // 2. Get default AI provider

    const provider = await this.prisma.aIProvider.findFirst({
      where: {
        isDefault: true,
        enabled: true,
      },
    });

    if (!provider) {
      throw new BadRequestException('AI provider not available');
    }

    const previousChats = await this.prisma.chatHistory.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 5,
    });

    const context = previousChats
      .reverse()
      .map((chat) => `User: ${chat.prompt}\nAI: ${chat.response}`)
      .join('\n\n');

    const finalPrompt = `
Previous conversation:

${context}


Current question:

${prompt}
`;

    // 3. Generate AI response

    let response: string;

    try {
      response = await this.aiService.generateResponse(finalPrompt);
    } catch (error) {
      throw new BadRequestException(
        'AI service is temporarily unavailable. Please try again later.',
      );
    }
    // 4. Save chat history

    const chat = await this.prisma.chatHistory.create({
      data: {
        userId,

        providerId: provider.id,

        prompt,

        response,
      },
    });

    // 5. Save usage log

    await this.prisma.aPIUsageLog.create({
      data: {
        userId,

        endpoint: '/chat',

        statusCode: 200,

        responseTime: 300,
      },
    });

    return {
      message: 'Chat completed',

      chat,
    };
  }
}
