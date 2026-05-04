import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatMessageDto) {}
