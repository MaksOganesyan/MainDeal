import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { userrole_role } from '@prisma/client';
import { AuthDto } from './auth.dto';

export class RegisterDto extends AuthDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(userrole_role)
  @IsOptional()
  role?: userrole_role;

  @IsString()
  @IsOptional()
  roleString?: string;
}

export class CreateExecutorDto extends AuthDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
