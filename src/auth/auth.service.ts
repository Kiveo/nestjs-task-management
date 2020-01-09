import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async signUp(authCredentailsDto: AuthCredentailsDto): Promise<void> {
    return this.userRepository.signUp(authCredentailsDto);
  }

  async signIn(authCredentailsDto: AuthCredentailsDto) {
    const username = await this.userRepository.validateUserPassword(
      authCredentailsDto
    );
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
