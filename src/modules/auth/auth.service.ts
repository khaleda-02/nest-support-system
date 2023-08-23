import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/Register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { hash, compare } from 'bcrypt';

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
    return { user, accessToken: this.JwtService.sign(user) };
  }

  async register(registerDto: RegisterDto) {
    registerDto.password = await hash(registerDto.password, 10);
    const { password, ...user } = await this.userService.create(registerDto);
    return { user };
  }
}
