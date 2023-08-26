import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { User } from './models/user.model';
import { USER_REPOSITORY } from 'src/common/contants';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { EmailService } from '../email/email.service';
import { hash } from 'bcrypt';
import { OTPCodeGenerator } from 'src/util';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository, // private emailService: EmailService
  ) {}

  //! Base Methods
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (user) throw new BadRequestException('User already exists');

    const otp = OTPCodeGenerator();
    const hashedOtp = await hash(`${otp}`, 10);
    const newUser = await this.userRepository.create({
      ...createUserDto,
      otp: hashedOtp,
      otpExpiry: Date.now() + 3600000,
    });
    // await this.emailService.userConfirmation(user.id, otp);

    return newUser.get({ plain: true });
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('wrong username or password');
    return user.get({ plain: true });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('wrong username or password');
    return user;
  }
}
