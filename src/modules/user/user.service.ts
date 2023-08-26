import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './models/user.model';
import { USER_REPOSITORY } from 'src/common/contants';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository,
  ) {}

  //! Base Methods
  async create({ username, password, email }: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) throw new BadRequestException('User already exists');

    const newUser = await this.userRepository.create({
      username,
      password,
      email,
    });
    return newUser.get({ plain: true });
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('wrong username or password');
    return user.get({ plain: true });
  }
}
