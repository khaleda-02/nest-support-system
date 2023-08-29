import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { FindOptions, Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';

@Injectable()
export class AdminTicketService {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository,
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

    return await ticket.update(
      { ...ticketDto, updatedAt: new Date(), updatedBy: userId },
      { transaction },
    );
  }
}
