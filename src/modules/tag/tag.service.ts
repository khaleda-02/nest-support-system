import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TAG_REPOSITORY, TICKET_TAG__REPOSITORY } from 'src/common/contants';
import { Transaction } from 'sequelize';
import { TicketTag } from './models/ticket-tag.model';

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
    // const TicketTag = await this.ticketTagRepository.create({
    //   tagId,
    //   ticketId,
    // });
    // console.log('in tag ticket fun ', TicketTag);

    const tags = await this.tagRepository.findAll();
    console.log(tags);
    console.log('----------------------------------------------------------');

    const test = await this.ticketTagRepository.findAll({
      where: { tagId },
      include: [
        {
          model: TicketTag,
          // attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });
    console.log('after incule ----------------- ', test);

    return `This action returns a #${tagId} tag`;
  }
}
