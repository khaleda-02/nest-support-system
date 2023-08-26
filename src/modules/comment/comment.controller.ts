import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { UserIdentity } from 'src/common/decorators/user.decorator';

@Roles(Role.STAFF, Role.USER)
@Controller('comments/tickets')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':ticketId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user,
  ) {
    return this.commentService.create(createCommentDto, ticketId, user.id);
  }

  @Get(':ticketId')
  findAll(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.commentService.findAll(ticketId);
  }
}
