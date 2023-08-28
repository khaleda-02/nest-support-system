import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TAG_REPOSITORY, TICKET_TAG__REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { TicketTag } from './models/ticket-tag.model';
import { Tag } from './models/tag.model';
import { Ticket } from '../ticket/models/ticket.model';

@Injectable()
export class TagService {
  constructor(
    @Inject(TICKET_TAG__REPOSITORY)
    private ticketTagRepository,
    @Inject(TAG_REPOSITORY)
    private tagRepository,
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
    // const
    return await this.tagRepository.findAll();
  }

  async tagATicket(tagId: number, ticketId: number, userId: number) {
    //verify if the ticket is own for the user and the ticket existing
    const test = await this.ticketTagRepository.scope('withTag').findAll({
      where: { tagId },
    });
    return test;
  }
}
