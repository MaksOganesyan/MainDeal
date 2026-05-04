import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  Validate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PasswordValidator } from '../validators/password.validator';
import { userrole_role } from '@prisma/client';

export class AuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must contain both uppercase and lowercase letters',
  })
  @Validate(PasswordValidator)
  password: string;

  @IsEnum(userrole_role, { message: 'Invalid role' })
  @IsOptional()
  role?: userrole_role;
}
