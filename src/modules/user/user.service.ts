import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { User } from './models/user.model';
import { USER_REPOSITORY } from 'src/common/contants';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { EmailService } from '../email/email.service';
import { hash, compare } from 'bcrypt';
import { OTPCodeGenerator } from 'src/util';
import { UpdateUserDto } from './dto/update-user-info.dto';
import { Role, UserStatus } from 'src/common/enums';
interface IUserInfo {
  roles?: Role;
  status?: UserStatus;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
  ) {}

  //! Base Methods
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (user) throw new BadRequestException('User already exists');

    const otp = OTPCodeGenerator();
    const hashedOtp = await hash(`${otp}`, 10);
    createUserDto.password = await hash(createUserDto.password, 10);
    const newUser = await this.userRepository.create({
      ...createUserDto,
      otp: hashedOtp,
      otpExpiry: Date.now() + 3600000,
    });

    await this.emailService.sendOtp(newUser.id, otp);

    return newUser.get({ plain: true });
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository
      .scope('login')
      .findOne({ where: { username } });
    if (!user) throw new NotFoundException('user not found');
    return user.get({ plain: true });
  }

  //! Helper Functions
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  // func => change the user's status and rolse .
  async verifyAndUpdateUser(id: number, otp: string, data: IUserInfo) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    const isVerified = await compare(otp, user.otp);
    if (!isVerified) throw new BadRequestException('otp not valid');
    await user.update({ ...data });
    return user;
  }

  // async verifyUser(id: number, otp: string) {
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (!user) throw new NotFoundException('user not found');
  //   const isVerified = await compare(otp, user.otp);
  //   user.status = UserStatus.ACTIVE;
  //   await user.save();
  //   return isVerified;
  // }
  // func => make an otp for a user : verify him && invite & accept staffs
  async createAndSendOtp(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    const otp = OTPCodeGenerator();
    const hashedOtp = await hash(`${otp}`, 10);
    await user.update({
      otp: hashedOtp,
      otpExpiry: Date.now() + 3600000,
    });
    await this.emailService.sendOtp(user.id, otp);

    return user;
  }
}
