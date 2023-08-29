import { SetMetadata } from '@nestjs/common';
import { IS_STAFF_ASSIGN_TECKET_KEY } from '../contants';

export const AssignedStaff = () =>
  SetMetadata(IS_STAFF_ASSIGN_TECKET_KEY, true);
