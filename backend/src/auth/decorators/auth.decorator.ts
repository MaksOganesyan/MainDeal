import { applyDecorators, UseGuards } from '@nestjs/common';
import { userrole_role } from '@prisma/client';
import { CookieAuthGuard } from '../guards/cookie.guard';
import { Roles } from './roles.decorator';

export const Auth = (roles: userrole_role | userrole_role[] = [userrole_role.CUSTOMER]) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  return applyDecorators(Roles(...roles), UseGuards(CookieAuthGuard));
};
