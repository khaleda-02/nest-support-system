import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AssignedStaff } from 'src/common/decorators/staff-ticket.decorator';
import { Role, Status } from 'src/common/enums';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { StaffService } from '../services/staff.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction, WhereOptions } from 'sequelize';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { VerifyUserDto } from 'src/common/dtos/verify-user.dto';
import { IUser } from 'src/common/interfaces';
import { FilterDto } from 'src/common/dtos/search-filter.dto';
import { Op } from 'sequelize';

@Roles(Role.STAFF)
@UseInterceptors(TransactionInterceptor)
@Controller('staffs/')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get('tickets')
  findAll(@UserIdentity() user: IUser, @Query() filterDto: FilterDto) {
    const whereOptions = this.buildWhereOptions(filterDto);
    const paginationOptions = this.buildPaginationOptions(filterDto);
    return this.staffService.findAll(user, whereOptions, paginationOptions);
  }

  @Get('tickets/:ticketId')
  findOne(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user: IUser,
  ) {
    return this.staffService.findOne(ticketId, user);
  }

  @AssignedStaff() // decorator for enable gaurd for checking if the user assigned to a ticket
  @Put('tickets/:ticketId')
  update(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @UserIdentity() user: IUser,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.staffService.update(
      ticketId,
      updateTicketDto,
      user,
      transaction,
    );
  }

  @AssignedStaff()
  @Put('tickets/:ticketId/schedule')
  schedule(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() scheduleTicketDto: ScheduleTicketDto,
    @UserIdentity() user: IUser,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.staffService.update(
      ticketId,
      { ...scheduleTicketDto, status: Status.SCHEDULED },
      user,
      transaction,
    );
  }

  @Roles(Role.USER)
  @Post('accept')
  accept(@UserIdentity() user, @Body() { otp }: VerifyUserDto) {
    return this.staffService.accept(user.id, otp);
  }

  //? Filtering , Pagination methodes :
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
    const page = parseInt(filters.page) || 1;
    const pageSize = parseInt(filters.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return {
      offset,
      limit,
    };
  }
}
