import { Controller, Get, Req, Post, Body, UseGuards } from '@nestjs/common';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('history')
  @UseGuards(JwtGuard)
  getHistory(@Req() req: any) {
    return this.chatService.getHistory(req.user.userId);
  }
  @Post()
  @UseGuards(JwtGuard)
  createChat(@Req() req: any, @Body() dto: CreateChatDto) {
    return this.chatService.createChat(req.user.userId, dto.prompt);
  }
}
