import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    console.log('Received API key:', apiKey); // Log the received API key

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const isValid = await this.authService.validateApiKey(apiKey);

    console.log('Is API key valid:', isValid); // Log the validation result

    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
