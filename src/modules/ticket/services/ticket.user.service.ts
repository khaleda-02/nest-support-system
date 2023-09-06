import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { TICKET_REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Status } from 'src/common/enums';
import { EmailService } from 'src/modules/email/email.service';
import { Ticket } from '../models/ticket.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserTicketService {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: typeof Ticket,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    userId: number,
    transaction: Transaction,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.create(
      {
        ...createTicketDto,
        userId,
      },
      { transaction },
    );
    await this.emailService.newTicketEmail(userId, ticket.title);
    await this.cacheManager.del('userTickets');
    await this.cacheManager.del('adminTickets');
    return ticket;
  }

  async findAll(userId: number): Promise<Ticket[]> {
    const cacheTickets: Ticket[] = await this.cacheManager.get('userTickets');
    if (cacheTickets) return cacheTickets;

    const tickets = await this.ticketRepository.findAll({ where: { userId } });
    await this.cacheManager.set('userTickets', tickets);
    return tickets;
  }

  async findOne(id: number, userId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id, userId },
    });
    if (!ticket) throw new NotFoundException('ticket not found');
    return ticket;
  }

  async findOneById(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('ticket not found');
    return ticket;
  }

  async remove(id: number, userId: number, transaction: Transaction) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, userId },
    });

    if (!ticket) throw new BadRequestException(`Couldn not find a ticket`);

    ticket.deletedBy = `${userId}`;
    await this.cacheManager.del('userTickets');
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
    await this.cacheManager.del('userTickets');
    return await ticket.update({ ...createFeedbackDto }, { transaction });
  }

  async findCommon(): Promise<Ticket[]> {
    const cacheCommonTickets: Ticket[] = await this.cacheManager.get(
      'commonTickets',
    );
    if (cacheCommonTickets) return cacheCommonTickets;

    const commonTickets = await this.ticketRepository
      .scope('forCommon')
      .findAll();
    await this.cacheManager.set('commonTickets ', commonTickets);
    return commonTickets;
  }
}
