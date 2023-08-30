import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Transaction } from 'sequelize';
import {
  STAFF_TICKET__REPOSITORY,
  TICKET_REPOSITORY,
} from 'src/common/contants';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { Role } from 'src/common/enums';
import { EmailService } from 'src/modules/email/email.service';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { AdminTicketService } from 'src/modules/ticket/services';
import { User } from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(STAFF_TICKET__REPOSITORY)
    private staffTicketRepository,
    private ticketService: AdminTicketService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  //! tickets sercices
  async findAll(user: User) {
    if (user.roles.includes(Role.STAFF)) {
      return await this.staffTicketRepository.scope('withTicket').findAll({
        where: { staffId: user.id },
      });
    }
    return await this.ticketService.findAll();
  }

  async findOne(ticketId: number, user: User) {
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
    user: User,
    transactions: Transaction,
  ) {
    const updatedTicket = await this.ticketService.update(
      ticketId,
      ticketDto,
      user.id,
      transactions,
    );
    // todo askhatem , here I just send an email just in status update case ,
    // do I need to send an email in all cases {status , priority , scheduled}
    if ('status' in ticketDto) {
      this.emailService.ticketUpdated(
        updatedTicket.userId,
        updatedTicket.title,
      );
    }
    return updatedTicket
      ? `ticket ${ticketId} updated successfully`
      : new BadRequestException();
  }

  //! staff serciess
  async accept() {
    // get the OTP from body ,
    // verify it , then add the user into staff table ,
    // change the role of him
    // TODO verify the otp , chagne the user's role to staff
  }

  //! admin services
  async invite(userId: number) {
    await this.userService.createAndSendOtp(userId);
    // await this.userService.findOneByIdAndUpdate(userId, { roles: Role.STAFF });
  }

  //Todo: ask hatem ,what's should happen if the staff assigns to a ticket ,
  // and how can I chage the status of each ticket was assigned to that staff . maybe a map
  async remove(userId: number) {
    // find
    // this.userService.findOneById(userId);
    // destory
    // TODO change the user role => staff to user , and  re open the
  }
  async assign(staffId: number, ticketId: number) {
    // TODO askhatem is this checking if the user role => staff & checking from the ticket if exists good practice
    const user = await this.userService.findOneById(staffId);
    if (!user || !user.roles.includes(Role.STAFF))
      throw new BadRequestException(`staff not found`);

    const ticket = await this.ticketService.findOne(ticketId);
    if (!ticket) throw new BadRequestException(`ticket not found`);

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

  // guard function to check if the staff is assigned to a ticket
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
