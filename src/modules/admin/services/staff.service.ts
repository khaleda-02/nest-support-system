import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction, WhereOptions } from 'sequelize';
import { STAFF_TICKET__REPOSITORY } from 'src/common/contants';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { Role } from 'src/common/enums';
import { EmailService } from 'src/modules/email/email.service';
import { AdminTicketService } from 'src/modules/ticket/services';
import { UserService } from 'src/modules/user/user.service';
import { StaffsTicket } from '../models/staff-ticket.model';
import { IUser } from 'src/common/interfaces';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { Op } from 'sequelize';
import { Status } from 'src/common/enums';
import { Gateway } from 'src/modules/real-time/real-time.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StaffService {
  constructor(
    @Inject(STAFF_TICKET__REPOSITORY)
    private staffTicketRepository: typeof StaffsTicket,
    private ticketService: AdminTicketService,
    private userService: UserService,
    private emailService: EmailService,
    private gateway: Gateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(
    user: IUser,
    whereOptions: WhereOptions = {},
    paginationOptions = {},
  ): Promise<StaffsTicket[]> {
    const cacheTickets: StaffsTicket[] = await this.cacheManager.get(
      'staffTickets',
    );
    if (cacheTickets) return cacheTickets;

    const tickets = await this.staffTicketRepository
      .scope('withTicket')
      .findAll({
        where: { staffId: user.id, ...whereOptions },
        ...paginationOptions,
      });
    await this.cacheManager.set('staffTickets', tickets);
    return tickets;
  }

  async findOne(ticketId: number, user: IUser): Promise<Ticket | StaffsTicket> {
    return await this.staffTicketRepository.scope('withTicket').findOne({
      where: { staffId: user.id, ticketId },
    });
  }

  // here . staff is always verified
  async update(
    ticketId: number,
    ticketDto: UpdateTicketDto | ScheduleTicketDto,
    user: IUser,
    transactions: Transaction,
  ): Promise<string | HttpException> {
    // update fun , will notify user , email user , cleare cache [admin , staff , user]
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

  // Delay Ticekts without changing the status : 1- after 1 day of scheduling be staff . 2- after 2 days of assignment
  // every midnight :
  // got all dely tickets (scheduled $or assignment)
  // loop it and send a email to the assigned staff .
  // 12 : 00 , 4-8  , find all ticket with scheduled date with 

}
