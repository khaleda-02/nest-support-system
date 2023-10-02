import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { AdminService } from '../services/admin.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionDecorator } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Roles(Role.ADMIN)
@UseInterceptors(TransactionInterceptor)
@Controller('admins/staffs')
export class AdminStaffController {
  constructor(private adminService: AdminService) {}

  @Get(':userId')
  invite(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.invite(userId);
  }

  @Delete(':userId')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminService.remove(userId, transaction);
  }


  
  @Get(':staffId/tickets/:ticketId')
  assign(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminService.assign(staffId, ticketId, transaction);
  }

  @Delete(':staffId/tickets/:ticketId')
  unAssign(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @TransactionDecorator() transaction: Transaction,
  ) {
    return this.adminService.unAssign(staffId, ticketId, transaction);
  }
}
