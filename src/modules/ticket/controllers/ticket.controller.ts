import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Transaction } from 'sequelize';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { UserTicketService } from '../services';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Role } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(TransactionInterceptor)
@Roles(Role.USER)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: UserTicketService) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.create(createTicketDto, user.id, transaction);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@UserIdentity() user) {
    return this.ticketService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserIdentity() user) {
    return this.ticketService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.remove(id, user.id, transaction);
  }

  @Post(':id/feedback')
  feedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.feedback(
      id,
      createFeedbackDto,
      user.id,
      transaction,
    );
  }
}
