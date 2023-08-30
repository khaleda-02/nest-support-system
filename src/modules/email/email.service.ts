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
//! I made it separated , because the above approach is hard to update and not open for extensions and closed for modifaction
//!  => easy to update , rather than go to each file and update ,
@Injectable()
export class EmailService {
  private logger = new Logger();
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async send(userId: number, subject: string, text: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    const to = user.email;
    await sendEmail({ subject, from: 'khaleda.02f@gmail.com', to, text });

    //TODO: add the new eamil into the table
    this.logger.log(`Email Sent to ${to}`);
  }

  // user verification , statff creation
  async sendOtp(userId: number, otp: number) {
    await this.send(
      userId,
      'Staff Invitation',
      `Hey ,your code ${otp} , valid in an hour `,
    );
  }

  async newTicketEmail(userId: number, title: string) {
    await this.send(
      userId,
      'New Ticket Created',
      `Hey , we just want you to know that you have created a new ticket , with titile ${title} `,
    );
  }

  async ticketUpdated(userId: number, title: string) {
    await this.send(
      userId,
      'Your Ticket Has Updated ',
      `Hey , we just want you to know that tickets '${title}' has updated `,
    );
  }

  async AssignTicket(userId: number) {
    await this.send(
      userId,
      'New Ticket Assignment',
      `Hey ,our admins assigned a new ticket to you , 
      pelase check your assigned tickets `,
    );
  }
}
