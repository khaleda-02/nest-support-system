import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { COMMENT_REPOSITORY } from 'src/common/contants';
import { EmailService } from 'src/modules/email/email.service';
import { UserTicketService } from './ticket.user.service';
import { AdminService } from 'src/modules/admin/services/admin.service';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private commentRepository,
    private emailService: EmailService,
    private ticketService: UserTicketService,
    private adminService: AdminService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    ticketId: number,
  ) {
    //TODO askhatem  check if the staff assigned to this ticket , and  the user own the ticket
    const ticket = await this.isValid(userId, ticketId);
    const comment = await this.commentRepository.create({
      ...createCommentDto,
      ticketId,
      userId,
    });
    await this.emailService.ticketUpdated(ticket.userId, ticket.title);
    return comment;
  }

  async findAll(ticketId: number, userId: number) {
    await this.isValid(userId, ticketId);
    return this.commentRepository.findAll({
      where: { ticketId },
    });
  }

  async isValid(userId: number, ticketId: number) {
    const isAssigned = await this.adminService.isStaffAssignedTicket(
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
