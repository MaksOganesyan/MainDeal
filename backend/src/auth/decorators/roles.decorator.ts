import { SetMetadata } from '@nestjs/common';
import { userrole_role } from '@prisma/client';

export const Roles = (...roles: userrole_role[]) => SetMetadata('roles', roles);
