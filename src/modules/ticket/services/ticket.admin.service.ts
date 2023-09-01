import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { FindOptions, Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { EmailService } from 'src/modules/email/email.service';
import moment from 'moment';
import { Ticket } from '../models/ticket.model';

@Injectable()
export class AdminTicketService {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository,
    private emailService: EmailService,
  ) {}

  async findAll() {
    return await this.ticketRepository.findAll();
  }

  async findOne(id: number) {
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
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!ticket) throw new NotFoundException('ticket not found');

    const updatedTicket = await ticket.update(
      { ...ticketDto, updatedAt: moment().utc().toDate(), updatedBy: userId },
      { transaction },
    );
    this.emailService.ticketUpdated(updatedTicket.userId, updatedTicket.title);
    return updatedTicket;
  }
}
