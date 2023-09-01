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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { IUser } from 'src/common/interfaces';

@Roles(Role.USER)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @UserIdentity() user: IUser,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.tagService.create(createTagDto, user.id, transaction);
  }

  @Get('ticket/:ticketId')
  findAllTicketTags(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user: IUser,
  ) {
    return this.tagService.findAllTicketTags(ticketId, user.id);
  }

  @Get(':tagId/ticket/:ticketId')
  tagATicket(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user: IUser,
  ) {
    return this.tagService.tagATicket(tagId, ticketId, user.id);
  }
}
