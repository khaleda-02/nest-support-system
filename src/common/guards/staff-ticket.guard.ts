import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_STAFF_ASSIGN_TECKET_KEY } from '../contants';
import { config } from 'dotenv';
import { Role } from '../enums';
import { AdminService } from 'src/modules/admin/services/admin.service';
export class AssignedStaffGuard implements CanActivate {
  private logger = new Logger(AssignedStaffGuard.name);

  constructor(
    private reflector: Reflector,
    private adminService: AdminService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isStaffAssignTicket = this.reflector.getAllAndOverride<boolean>(
        IS_STAFF_ASSIGN_TECKET_KEY,
        [context.getClass(), context.getHandler()],
      );

      if (!isStaffAssignTicket) return true;

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (user.roles !== Role.STAFF) return false;
      return await this.adminService.isStaffAssignedTicket(
        parseInt(request.user.id),
        parseInt(request.params.ticketId),
      );
    } catch (err) {
      return false;
    }
  }
}
