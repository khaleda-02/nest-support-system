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
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { AdminService } from '../services/admin.service';

@Roles(Role.ADMIN)
@UseInterceptors(TransactionInterceptor)
@Controller('admins/tickets')
export class AdminTicketController {
  constructor(private adminService: AdminService) {}

  @Get()
  findAll(@UserIdentity() user) {
    return this.adminService.findAll(user);
  }

  @Get(':ticketId')
  findOne(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user,
  ) {
    return this.adminService.findOne(ticketId, user);
  }

  @Put(':ticketId')
  update(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminService.update(
      ticketId,
      updateTicketDto,
      user,
      transaction,
    );
  }
}
