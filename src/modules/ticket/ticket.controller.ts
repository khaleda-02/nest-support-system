import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Transaction } from 'sequelize';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { UserTicketService } from './services';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Role } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';

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

  @Get()
  findAll(@UserIdentity() user) {
    return this.ticketService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserIdentity() user) {
    return this.ticketService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.update(id, updateTicketDto, user.id, transaction);
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
    createFeedbackDto: CreateFeedbackDto,
    @UserIdentity() user,
  ) {
    // return this.ticketService.createFeedback(id, createFeedbackDto);
  }
}
