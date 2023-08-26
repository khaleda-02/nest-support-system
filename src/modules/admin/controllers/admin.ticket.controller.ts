import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { AdminTicketService } from 'src/modules/ticket/services';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';

@Roles(Role.ADMIN, Role.STAFF)
@UseInterceptors(TransactionInterceptor)
@Controller('admins/tickets')
export class AdminTicketController {
  constructor(private adminTicketService: AdminTicketService) {}

  @Get()
  findAll() {
    return this.adminTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminTicketService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminTicketService.update(
      id,
      updateTicketDto,
      user.id,
      transaction,
    );
  }
}
