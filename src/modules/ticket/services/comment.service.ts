import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { COMMENT_REPOSITORY } from 'src/common/contants';
import { EmailService } from 'src/modules/email/email.service';
import { UserTicketService } from './ticket.user.service';
import { StaffService } from 'src/modules/admin/services/staff.service';
import { Comment } from '../models/comment.model';
import { Gateway } from 'src/modules/real-time/real-time.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private commentRepository: typeof Comment,
    private emailService: EmailService,
    private ticketService: UserTicketService,
    private staffService: StaffService,
    private gateway: Gateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    ticketId: number,
  ): Promise<Comment> {
    const ticket = await this.isValid(userId, ticketId); // isValid witll throw exception in case of invalid ticket
    const comment = await this.commentRepository.create({
      ...createCommentDto,
      ticketId,
      userId,
    });
    this.gateway.notifyUser(
      ticket.userId,
      `new coomment added on ticket ${ticket.title} `,
    );
    await this.emailService.ticketUpdated(ticket.userId, ticket.title);
    await this.cacheManager.del(`${ticketId}Comments`);
    return comment;
  }

  async findAll(ticketId: number, userId: number): Promise<Comment[]> {
    await this.isValid(userId, ticketId);
    const ticketComments: Comment[] = await this.cacheManager.get(
      `${ticketId}Comments`,
    );
    if (ticketComments) return ticketComments;
    const comments = await this.commentRepository.findAll({
      where: { ticketId },
    });
    return comments;
  }

  async isValid(userId: number, ticketId: number) {
    const isAssigned = await this.staffService.isStaffAssignedTicket(
      userId,
      ticketId,
    );
    const ticket = await this.ticketService.findOneById(ticketId);
    if (isAssigned || ticket.userId == userId) {
      return ticket;
    }
    throw new BadRequestException();
  }
}
