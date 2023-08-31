import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

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
    return this.commentService.create(createCommentDto, user.id, ticketId);
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':ticketId')
  findAll(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user,
  ) {
    return this.commentService.findAll(ticketId, user.id);
  }
}
