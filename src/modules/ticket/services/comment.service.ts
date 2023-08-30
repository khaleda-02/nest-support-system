import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { COMMENT_REPOSITORY } from 'src/common/contants';
import { EmailService } from 'src/modules/email/email.service';
import { UserTicketService } from './ticket.user.service';
import { UserService } from 'src/modules/user/user.service';
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
    ticketId: number,
    userId: number,
  ) {
    console.log('in create comment ');
    //TODO askhatem  check if the staff assigned to this ticket , and  the user own the ticket
    const isAssigned = await this.adminService.isStaffAssignedTicket(
      userId,
      ticketId,
    );

    console.log('isAssigned', isAssigned);

    const ticket = await this.ticketService.findOneById(ticketId);
    if (isAssigned || ticket.userId == userId) {
      const comment = await this.commentRepository.create({
        ...createCommentDto,
        ticketId,
        userId,
      });
      await this.emailService.ticketUpdated(ticket.userId, ticket.title);
      return comment;
    }
    throw new BadRequestException();
  }

  findAll(ticketId: number) {
    return this.commentRepository.findAll({
      where: { ticketId },
    });
  }
}
