import { IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ComplaintStatus, ComplaintAction } from '@prisma/client';

export class CreateComplaintDto {
  @IsNumber()
  targetId: number;

  @IsOptional()
  @IsNumber()
  dealId?: number;

  @IsString()
  reason: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidence?: string[];
}

export class UpdateComplaintDto {
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsEnum(ComplaintAction)
  action?: ComplaintAction;
}

export class ResolveComplaintDto {
  @IsString()
  resolution: string;

  @IsEnum(ComplaintAction)
  action: ComplaintAction;
}

