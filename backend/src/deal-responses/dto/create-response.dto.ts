import { IsString, IsOptional, IsNumber, IsArray, Min, IsInt } from 'class-validator';

export class CreateDealResponseDto {
  @IsInt()
  dealId: number;

  @IsString()
  message: string; // Cover letter

  @IsOptional()
  @IsNumber()
  @Min(0)
  proposedPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioLinks?: string[];

  @IsOptional()
  @IsString()
  experience?: string;
}

export class UpdateResponseStatusDto {
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

