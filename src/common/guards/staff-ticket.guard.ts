import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_STAFF_ASSIGN_TECKET_KEY } from '../contants';
import { config } from 'dotenv';
import { Role } from '../enums';
import { StaffService } from 'src/modules/admin/services/staff.service';
export class AssignedStaffGuard implements CanActivate {
  private logger = new Logger(AssignedStaffGuard.name);

  constructor(
    private reflector: Reflector,
    private staffService: StaffService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isStaffAssignmentRequired =
        this.reflector.getAllAndOverride<boolean>(IS_STAFF_ASSIGN_TECKET_KEY, [
          context.getClass(),
          context.getHandler(),
        ]);

      if (!isStaffAssignmentRequired) return true;

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (user.roles !== Role.STAFF) return false;

      return await this.staffService.isStaffAssignedTicket(
        parseInt(request.user.id),
        parseInt(request.params.ticketId),
      );
    } catch (err) {
      return false;
    }
  }
}
