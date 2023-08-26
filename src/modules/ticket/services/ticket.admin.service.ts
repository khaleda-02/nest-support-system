import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';

// ToDo : how to deal with multiple roles in services 
// ToDo : toask can the admin and staff create and remove tickets.
// ToDo : toask can the admin and staff update the priority of a ticket .
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
    updateTicketDto: UpdateTicketDto,
    userId: number,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!ticket) throw new NotFoundException('ticket not found');

    return await ticket.update(
      { ...updateTicketDto, updatedAt: new Date(), updatedBy: userId },
      { transaction },
    );
  }
}
