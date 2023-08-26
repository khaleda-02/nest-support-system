import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';
import { ROLES_KEY } from '../contants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
