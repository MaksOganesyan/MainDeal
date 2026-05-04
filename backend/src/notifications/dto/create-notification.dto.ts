import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  relatedId?: number;

  @IsOptional()
  @IsString()
  link?: string;
}

export class MarkAsReadDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

