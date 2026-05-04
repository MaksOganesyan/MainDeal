import { UserRole } from '@/services/auth/auth.types';

export interface IUser {
  id: number;
  name?: string;
  login: string;
  email?: string;
  avatarPath?: string;
  verificationToken?: string;
  roles: UserRole[];
}

export interface IFormData {
  email: string;
  password: string;
  login?: string;
  role?: UserRole;
}