import { Injectable, Logger } from '@nestjs/common';
import { sendEmail, OTPCodeGenerator } from 'src/util/';
import { UserService } from '../user/user.service';
@Injectable()
export class MailService {
  private logger = new Logger();
  constructor(private userService: UserService) {}

  async sendTest() {
    this.logger.debug('in sendTest');
    const OTP = OTPCodeGenerator();
    // const user = await this.userService.findOneAndUpdate(
    //   { email },
    //   {
    //     OTP: await bcrypt.hash(`${OTP}`, 12),
    //     OTPCodeExpiration: Date.now() + 3600000,
    //   },
    //   { new: true },
    // );

    // if (!user) {
    //   res.status(400);
    //   throw new Error('user not found ');
    // }

    await sendEmail({
      subject: 'test email',
      from: 'khaleda.02f@gmail.com',
      to: 'khaledalkhalili179405@gmail.com',
      text: `Your code is: ${OTP} , one hour to exiper `,
    });
    // const url = `examplee.com/auth/confirm?token=${token}`;
    this.logger.debug('after send mail');
  }
}
