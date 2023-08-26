import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { sendEmail, OTPCodeGenerator } from 'src/util/';
import { UserService } from '../user/user.service';
import { IEmailOptions } from 'src/common/interfaces';

//! instead of one function that take the options as a parameter [for all eamil cases],
//! I made it seperated , because the above approach is hard to update and not open for extensions and closed for modifaction
@Injectable()
export class EmailService {
  private logger = new Logger();
  constructor(private userService: UserService) {}

  async send(userId: number, subject: string, text: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    const to = user.email;
    await sendEmail({ subject, from: 'khaleda.02f@gmail.com', to, text });
    this.logger.log(`Email Sent to ${to}`);
  }

  //? USER EMAILS :
  // const url = `examplee.com/auth/confirm?token=${token}`;
  async userConfirmation(userId: number, otp: string) {
    await this.send(
      userId,
      'User Confirmation',
      `Your code is: ${otp} , one hour to exiper `,
    );
  }

  ticket() {}
  ticketUpdated() {}

  //? STAFF EMAILS :
  staffInvitation() {}
  AssignTicket() {}
}
