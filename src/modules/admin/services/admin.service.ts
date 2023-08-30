import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { STAFF_TICKET__REPOSITORY } from 'src/common/contants';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { Role } from 'src/common/enums';
import { EmailService } from 'src/modules/email/email.service';
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
    return updatedTicket
      ? `ticket ${ticketId} updated successfully`
      : new BadRequestException();
  }

  //! staff serciess
  async accept(userId: number, otp: string, transaction: Transaction) {
    await this.userService.verifyAndUpdateUser(
      userId,
      otp,
      { roles: Role.STAFF },
      transaction,
    );
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
    // ماش المفروض اني
    // it's suppord that when I try to add a non exists staff here, gives me an error , bevause of the forign key
    // TODO askhatem is this checking if the user role => staff & checking from the ticket if exists good practice
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
