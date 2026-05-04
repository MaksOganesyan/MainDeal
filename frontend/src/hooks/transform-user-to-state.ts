import { type TProtectUserData, UserRole } from '@/services/auth/auth.types';

export type TUserDataState = {
  id: number;
  roles: UserRole[];
  isLoggedIn: boolean;
  isCustomer: boolean;
  isExecutor: boolean;
  isSupport: boolean;
  isAdmin: boolean;
};

export const transformUserToState = (
  user: TProtectUserData
): TUserDataState | null => {
  console.log("transformUserToState input:", user);
  
  if (!user) {
    console.log("No user data");
    return null;
  }

  let roles: UserRole[] = [];
  
  if (user.roles && Array.isArray(user.roles)) {
    roles = user.roles as UserRole[];
  } else if (user.userrole && Array.isArray(user.userrole)) {
    roles = user.userrole
      .map((ur: any) => ur?.role)
      .filter(Boolean) as UserRole[];
  }

  console.log("Extracted roles:", roles);
  
  if (roles.length === 0) {
    console.log("No roles found, defaulting to CUSTOMER");
    return {
      id: user.id,
      roles: [UserRole.CUSTOMER],
      isLoggedIn: true,
      isCustomer: true,
      isExecutor: false,
      isSupport: false,
      isAdmin: false,
    };
  }

  return {
    id: user.id,
    roles,
    isLoggedIn: true,
    isCustomer: roles.includes(UserRole.CUSTOMER),
    isExecutor: roles.includes(UserRole.EXECUTOR),
    isSupport: roles.includes(UserRole.MANAGER),
    isAdmin: roles.includes(UserRole.ADMIN),
  };
};