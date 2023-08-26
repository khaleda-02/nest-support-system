import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Status } from 'src/common/enums';

@Injectable()
export class UserTicketService {
  private logger = new Logger();
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    userId: number,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketRepository.create(
      {
        ...createTicketDto,
        userId,
      },
      { transaction },
    );

    return ticket;
  }

  async findAll(userId: number) {
    return await this.ticketRepository.findAll({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, userId },
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
      where: { id, userId },
    });

    if (!ticket) throw new NotFoundException('ticket not found');

    return await ticket.update(
      { ...updateTicketDto, updatedAt: new Date(), updatedBy: userId },
      { transaction },
    );
  }

  async remove(id: number, userId: number, transaction: Transaction) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, userId },
    });

    if (!ticket) throw new BadRequestException(`Couldn not find a ticket`);

    ticket.deletedBy = userId;
    return await ticket.destroy({ transaction });
  }

  async feedback(
    id: number,
    createFeedbackDto: CreateFeedbackDto,
    userId: number,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { userId, id },
    });

    if (!ticket) throw new NotFoundException('Could not find the ticket');
    if (ticket.status !== Status.CLOSED)
      throw new BadRequestException(
        "can't give a feedbace for not closed tickets",
      );

    return await ticket.update({ ...createFeedbackDto }, { transaction });
  }
}
