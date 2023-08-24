import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Transaction } from 'sequelize';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';

@UseInterceptors(TransactionInterceptor)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

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
  findOne(@Param('id') id: string, @UserIdentity() user) {
    return this.ticketService.findOne(+id, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.update(
      +id,
      updateTicketDto,
      user.id,
      transaction,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.ticketService.remove(+id, user.id, transaction);
  }
}
