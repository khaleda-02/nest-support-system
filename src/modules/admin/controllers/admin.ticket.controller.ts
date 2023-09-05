import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  Query,
  Inject,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction, WhereOptions } from 'sequelize';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { AdminService } from '../services/admin.service';
import { IUser } from 'src/common/interfaces';
import { Op } from 'sequelize';
import { FilterDto } from 'src/common/dtos/search-filter.dto';

@Roles(Role.ADMIN)
@UseInterceptors(TransactionInterceptor)
@Controller('admins/tickets')
export class AdminTicketController {
  constructor(private adminService: AdminService) {}

  @Get()
  findAll(@UserIdentity() user: IUser) {
    return this.adminService.findAll(user);
  }

  @Get(':ticketId')
  findOne(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user: IUser,
  ) {
    return this.adminService.findOne(ticketId, user);
  }

  @Put(':ticketId')
  update(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user: IUser,
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
