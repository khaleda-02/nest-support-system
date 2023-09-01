import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AssignedStaff } from 'src/common/decorators/staff-ticket.decorator';
import { Role } from 'src/common/enums';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { AdminService } from '../services/admin.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { UpdateTicketDto } from 'src/common/dtos/update-ticket.dto';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ScheduleTicketDto } from 'src/common/dtos/schedule-ticket.dto';
import { VerifyUserDto } from 'src/common/dtos/verify-user.dto';
import { IUser } from 'src/common/interfaces';

@Roles(Role.STAFF)
@UseInterceptors(TransactionInterceptor)
@Controller('staffs/')
export class StaffController {
  constructor(private adminService: AdminService) {}
  @Get('tickets')
  findAll(@UserIdentity() user: IUser) {
    return this.adminService.findAll(user);
  }
  @Get('tickets/:ticketId')
  findOne(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UserIdentity() user: IUser,
  ) {
    return this.adminService.findOne(ticketId, user);
  }

  @AssignedStaff() // decorator for enable gaurd for checking if the user assigned to a ticket
  @Put('tickets/:ticketId')
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

  @AssignedStaff()
  @Put('tickets/:ticketId/schedule')
  schedule(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() scheduleTicketDto: ScheduleTicketDto,
    @UserIdentity() user: IUser,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminService.update(
      ticketId,
      scheduleTicketDto,
      user,
      transaction,
    );
    //todo eamil staff after 1 days
  }

  @Roles(Role.USER)
  @Post('accept')
  accept(@UserIdentity() user, @Body() { otp }: VerifyUserDto) {
    return this.adminService.accept(user.id, otp);
  }
}
