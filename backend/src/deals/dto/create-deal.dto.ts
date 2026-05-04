import { IsString, IsOptional, IsArray, IsNumber, IsDateString, IsBoolean, IsEnum, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DealStatus } from '@prisma/client';

export class CreateDealDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  materials?: string[];

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  drawings?: string[];

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : null)
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  estimatedTime?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateDealDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  materials?: string[];

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  drawings?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  estimatedTime?: number;

  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class AssignExecutorDto {
  @IsNumber()
  executorId: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

export class SearchDealDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber()
  minBudget?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber()
  maxBudget?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @IsOptional()
  @IsString()
  sortBy?: 'budget' | 'date' | 'deadline';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class CalculatePriceDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  complexity?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  materials?: string[];

  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  @IsNumber()
  @Min(1)
  estimatedTime?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  location?: string;
}