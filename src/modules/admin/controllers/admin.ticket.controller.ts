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
  findAll(@UserIdentity() user: IUser, @Query() filterDto: FilterDto) {
    const whereOptions = this.buildWhereOptions(filterDto);
    const paginationOptions = this.buildPaginationOptions(filterDto);
    return this.adminService.findAll(user, whereOptions, paginationOptions);
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

  //? heloper methodes :
  buildWhereOptions(filters: FilterDto) {
    const { status, startDate, endDate } = filters;
    const whereOptions: WhereOptions = {};
    if (status) {
      whereOptions.status = status;
    }
    if (startDate && endDate) {
      whereOptions.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    return whereOptions;
  }

  buildPaginationOptions(filters: FilterDto) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return {
      offset,
      limit,
    };
  }
}
