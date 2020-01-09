import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentailsDto
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
}
