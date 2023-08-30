import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TAG_REPOSITORY, TICKET_TAG_REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { UserTicketService } from 'src/modules/ticket/services/ticket.user.service';

@Injectable()
export class TagService {
  constructor(
    @Inject(TICKET_TAG_REPOSITORY)
    private ticketTagRepository,
    @Inject(TAG_REPOSITORY)
    private tagRepository,
    private ticketService: UserTicketService,
  ) {}

  async create(
    { name }: CreateTagDto,
    userId: number,
    transaction: Transaction,
  ) {
    const tag = await this.tagRepository.findOne({
      where: { name, userId },
    });
    if (tag) throw new BadRequestException('tag is already exists');
    return await this.tagRepository.create({ name, userId }, { transaction });
  }

  async findAllTicketTags(ticketId: number, userId: number) {
    await this.ticketService.findOne(ticketId, userId);
    const tickets = await this.ticketTagRepository.scope('withTag').findAll({
      where: { ticketId },
    });
    return tickets;
  }

  async tagATicket(tagId: number, ticketId: number, userId: number) {
    await this.ticketService.findOne(ticketId, userId);
    return await this.ticketTagRepository.create({ tagId, ticketId });
  }
}
