import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    login: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    fullName?: string;
} 