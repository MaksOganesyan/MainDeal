import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { MessageType } from '@prisma/client';

export class CreateChatMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  // For manager: specify recipient (customer or executor)
  // For regular users: leave empty (message goes to manager)
  @IsInt()
  @IsOptional()
  recipientId?: number;
}

export class CreateChatRoomDto {
  @IsInt()
  dealId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  memberIds?: number[];
}

export class MarkAsReadDto {
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}