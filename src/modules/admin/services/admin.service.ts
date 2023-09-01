import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { STAFF_TICKET__REPOSITORY } from 'src/common/contants';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { Role } from 'src/common/enums';
import { EmailService } from 'src/modules/email/email.service';
import { AdminTicketService } from 'src/modules/ticket/services';
import { User } from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';
import { StaffsTicket } from '../models/staff-ticket.model';
import { IUser } from 'src/common/interfaces';

@Injectable()
export class AdminService {
  constructor(
    @Inject(STAFF_TICKET__REPOSITORY)
    private staffTicketRepository: typeof StaffsTicket,
    private ticketService: AdminTicketService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  async findAll(user: IUser): Promise<StaffsTicket[]> {
    if (user.roles.includes(Role.STAFF)) {
      return await this.staffTicketRepository.scope('withTicket').findAll({
        where: { staffId: user.id },
      });
    }
    return await this.ticketService.findAll();
  }

  async findOne(ticketId: number, user: IUser): Promise<StaffsTicket> {
    if (user.roles.includes(Role.STAFF)) {
      return await this.staffTicketRepository.scope('withTicket').findOne({
        where: { staffId: user.id, ticketId },
      });
    }
    return await this.ticketService.findOne(ticketId);
  }

  // here . staff is always verified
  async update(
    ticketId: number,
    ticketDto: UpdateTicketDto | ScheduleTicketDto,
    user: IUser,
    transactions: Transaction,
  ): Promise<string | HttpException> {
    const updatedTicket = await this.ticketService.update(
      ticketId,
      ticketDto,
      user.id,
      transactions,
    );
    return updatedTicket
      ? `ticket ${ticketId} updated successfully`
      : new BadRequestException();
  }

  //! staff serciess
  async accept(userId: number, otp: string): Promise<string | HttpException> {
    const newStaff: IUser = await this.userService.verifyAndUpdateUser(
      userId,
      otp,
      { roles: Role.STAFF },
    );
    return newStaff
      ? `accepted staff ${newStaff.username}`
      : new BadRequestException();
  }

  //! admin services
  async invite(userId: number) {
    await this.userService.createAndSendOtp(userId);
  }

  //Todo: askhatem ,what's should happen if the staff assigns to a ticket ,
  // and how can I chage the status of each ticket was assigned to that staff . maybe a map
  async remove(userId: number) {
    // find
    // this.userService.findOneById(userId);
    // destory
    // TODO change the user role => staff to user , and  re open the
  }

  async assign(staffId: number, ticketId: number) {
    const user = await this.userService.findOneById(staffId);
    if (!user || !user.roles.includes(Role.STAFF))
      throw new BadRequestException(`staff not found`);

    await this.ticketService.findOne(ticketId);

    const isAssigned = await this.staffTicketRepository.findOne({
      where: {
        ticketId,
        staffId,
      },
    });
    if (isAssigned)
      throw new BadRequestException('staff is already assigned to this ticket');
    const staffTicket = await this.staffTicketRepository.create({
      staffId,
      ticketId,
    });
    await this.emailService.AssignTicket(user.id);
    return staffTicket;
    // todo : corn job , email the staff after 2 daysschedule
  }

  async unAssign(staffId: number, ticketId: number) {
    const isAssigned = await this.staffTicketRepository.findOne({
      where: {
        ticketId,
        staffId,
      },
    });
    if (!isAssigned)
      throw new BadRequestException('staff is not assigned to this ticket ');

    const staffTicket = await this.staffTicketRepository.destroy({
      where: {
        ticketId,
        staffId,
      },
    });

    return staffTicket
      ? `staff ${staffId} unassigned successfully`
      : new BadRequestException();
  }

  // guard function => to check if the staff is assigned to a ticket || in comment service
  async isStaffAssignedTicket(
    staffId: number,
    ticketId: number,
  ): Promise<boolean> {
    const ticket = await this.staffTicketRepository.findOne({
      where: {
        ticketId,
        staffId,
      },
    });
    if (!ticket) return false;
    return true;
  }
}
