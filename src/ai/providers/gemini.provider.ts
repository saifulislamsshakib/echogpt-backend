import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiProvider {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  async generate(prompt: string) {
    try {
      const result = await this.model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      console.log(
        'Gemini Error:',
        error instanceof Error ? error.message : error,
      );

      throw error;
    }
  }
}
