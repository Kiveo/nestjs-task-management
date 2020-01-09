import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentailsDto: AuthCredentailsDto): Promise<void> {
    const { username, password } = authCredentailsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    await user.save();
  }
}
