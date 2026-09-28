import { Injectable } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';

@Injectable()
export class AiService {
  constructor(private geminiProvider: GeminiProvider) {}

  async generateResponse(prompt: string) {
    return this.geminiProvider.generate(prompt);
  }
}
