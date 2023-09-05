import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction, WhereOptions } from 'sequelize';
import { STAFF_TICKET__REPOSITORY } from 'src/common/contants';
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
export class AdminService {
  constructor(
    @Inject(STAFF_TICKET__REPOSITORY)
    private staffTicketRepository: typeof StaffsTicket,
    private ticketService: AdminTicketService,
    private userService: UserService,
    private emailService: EmailService,
    private gateway: Gateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(user: IUser): Promise<Ticket[]> {
    const cacheTickets: Ticket[] = await this.cacheManager.get('adminTickets');
    if (cacheTickets) return cacheTickets;

    const tickets = await this.ticketService.findAll();
    await this.cacheManager.set('adminTickets', tickets);
    return tickets;
  }

  async findOne(ticketId: number, user: IUser): Promise<Ticket | StaffsTicket> {
    return await this.ticketService.findOne(ticketId);
  }

  // here . staff is always verified
  async update(
    ticketId: number,
    ticketDto: UpdateTicketDto,
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

  async invite(userId: number) {      
    await this.userService.createAndSendOtp(userId);
  }

  async remove(staffId: number, transaction: Transaction) {
    const staff = await this.userService.findOneById(staffId);
    if (staff.roles != Role.STAFF)
      throw new BadRequestException('staff not found');

    // change the status of those tickets (non closed , non reserved) to open
    const staffTickets = await this.staffTicketRepository.findAll({
      where: { staffId },
      transaction,
    });
    // getting the assigned tickets for this staff
    const ticketIds = staffTickets.map(
      (entry) => entry.get({ plain: true }).ticketId,
    );
    const whereOptions: WhereOptions = {
      id: { [Op.in]: ticketIds },
      status: { [Op.notIn]: ['closed', 'reserved'] },
    };
    await this.ticketService.reOpenTickets(whereOptions, transaction);

    // remove all records from StaffsTickets that assigned to this staff
    await this.staffTicketRepository.destroy({
      where: { staffId },
      transaction,
    });

    // change the user role => staff to user
    staff.roles = Role.USER;
    return await staff.save({ transaction });
  }

  async assign(staffId: number, ticketId: number, transaction: Transaction) {
    const user = await this.userService.findOneById(staffId);
    if (!user || user.roles != Role.STAFF)
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
    const ticketDto: UpdateTicketDto = {
      status: Status.ASSIGNED,
    };
    // update ticket status
    await this.ticketService.update(ticketId, ticketDto, staffId, transaction);
    // email the user about the update
    this.gateway.notifyUser(user.id, `you assigned to ticket `);
    await this.emailService.assignTicket(user.id);
    await this.cacheManager.del('staffTickets');

    return staffTicket;
  }

  async unAssign(staffId: number, ticketId: number, transaction: Transaction) {
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
    const ticketDto: UpdateTicketDto = {
      status: Status.OPEN,
    };
    await this.ticketService.update(ticketId, ticketDto, staffId, transaction);
    await this.cacheManager.del('staffTickets');

    return staffTicket
      ? `staff ${staffId} unassigned successfully`
      : new BadRequestException();
  }
}
