import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { hash, compare } from 'bcrypt';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private JwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto) {
    const { password: userPassword, ...user } = await this.userService.findOne(
      username,
    );

    const isPasswordCorrect = await compare(password, userPassword);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('wrong username or password');
    return {
      user,
      accessToken: this.JwtService.sign({ username: user.username }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, 10);
    const { password, otp, ...user } = await this.userService.create(
      createUserDto,
    );
    return user;
  }
}
