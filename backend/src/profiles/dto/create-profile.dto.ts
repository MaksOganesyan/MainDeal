import { IsString, IsOptional, IsArray, IsInt, IsBoolean, IsUrl, Min, Max, ValidateIf } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specializations?: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateIf((o) => o.website !== '' && o.website !== null && o.website !== undefined)
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  showContactInfo?: boolean;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specializations?: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateIf((o) => o.website !== '' && o.website !== null && o.website !== undefined)
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  showContactInfo?: boolean;
}
