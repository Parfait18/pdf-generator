import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateApiDto } from './dto/generate-api.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate-api-key')
  async generateApiKey(
    @Body() body: GenerateApiDto,
  ): Promise<{ apiKey: string }> {
    const { email, firstName, lastName } = body;
    const apiKey = await this.authService.generateApiKey(
      email,
      firstName,
      lastName,
    );
    return { apiKey };
  }
}
