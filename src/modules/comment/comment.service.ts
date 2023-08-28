import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { COMMENT_REPOSITORY } from 'src/common/contants';

@Injectable()
export class CommentService {
  constructor(@Inject(COMMENT_REPOSITORY) private commentRepository) {}

  create(createCommentDto: CreateCommentDto, ticketId: number, userId: number) {
    //TODO: toask check if the staff assigned to this ticket , and the user own the ticket
    return this.commentRepository.create({
      ...createCommentDto,
      ticketId,
      userId,
    });
    //todo: send an eamil for the userID
  }

  findAll(ticketId: number) {
    return this.commentRepository.findAll({
      where: { ticketId },
    });
  }
}
