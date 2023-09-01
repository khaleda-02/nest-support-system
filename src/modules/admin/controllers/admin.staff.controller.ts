import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { AdminService } from '../services/admin.service';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces';

@Roles(Role.ADMIN)
@Controller('admins/staffs')
export class AdminStaffController {
  constructor(private adminService: AdminService) {}

  @Get('')
  findAll(@UserIdentity() user: IUser) {
    return this.adminService.findAll(user);
  }

  @Get(':userId')
  invite(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.invite(userId);
  }

  @Get(':userId')
  remove(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.remove(userId);
  }

  @Get(':staffId/tickets/:ticketId')
  assign(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ) {
    return this.adminService.assign(staffId, ticketId);
  }

  @Delete(':staffId/tickets/:ticketId')
  unAssign(
    @Param('staffId', ParseIntPipe) staffId: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ) {
    return this.adminService.unAssign(staffId, ticketId);
  }
}
