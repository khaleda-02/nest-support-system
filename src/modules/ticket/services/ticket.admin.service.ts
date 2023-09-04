import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { FindOptions, Transaction, WhereOptions } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { EmailService } from 'src/modules/email/email.service';
import * as moment from 'moment';
import { Ticket } from '../models/ticket.model';
import { Status } from 'src/common/enums';
import { Gateway } from 'src/modules/real-time/real-time.gateway';

@Injectable()
export class AdminTicketService {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: typeof Ticket,
    private emailService: EmailService,
    private gateway: Gateway,
  ) {}

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('ticket not found');
    return ticket;
  }

  async update(
    id: number,
    ticketDto: UpdateTicketDto | ScheduleTicketDto, // date for schudling ticket in staff cases
    userId: number,
    transaction: Transaction,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!ticket) throw new NotFoundException('ticket not found');

    const updatedTicket = await ticket.update(
      {
        ...ticketDto,
        updatedAt: moment().utc().toDate(),
        updatedBy: `${userId}`,
      },
      { transaction },
    );
    this.gateway.notifyUser(
      updatedTicket.userId,
      `your ticket ${updatedTicket.title} has updated`,
    );
    this.emailService.ticketUpdated(updatedTicket.userId, updatedTicket.title);
    return updatedTicket;
  }

  // single used function for re-open ticekts that was assigned to deleted staff [used in adminService]
  async reOpenTickets(options: WhereOptions, transaction: Transaction) {
    const updatedTickets = await this.ticketRepository.update(
      { status: Status.OPEN },
      {
        where: options,
        transaction,
      },
    );
    return updatedTickets;
  }
}
