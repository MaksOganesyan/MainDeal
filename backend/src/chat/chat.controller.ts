import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto, CreateChatRoomDto, MarkAsReadDto } from './dto/create-chat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('chat')
@Auth([userrole_role.CUSTOMER, userrole_role.EXECUTOR, userrole_role.MANAGER, userrole_role.ADMIN])
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  createRoom(@Body() createChatRoomDto: CreateChatRoomDto, @Request() req) {
    return this.chatService.createRoom(createChatRoomDto.dealId, req.user.id, createChatRoomDto);
  }

  @Post('rooms/announcement/:announcementId')
  createRoomForAnnouncement(
    @Param('announcementId', ParseIntPipe) announcementId: number,
    @Request() req
  ) {
    return this.chatService.createRoomForAnnouncement(announcementId, req.user.id);
  }

  @Get('rooms')
  findAllRooms(@Request() req) {
    return this.chatService.findAllRooms(req.user.id);
  }

  @Get('manager/rooms')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  findAllRoomsForManager(@Request() req) {
    return this.chatService.findAllRoomsForManager(req.user.id);
  }

  @Get('rooms/:id')
  findRoomById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.chatService.findRoomById(id, req.user.id);
  }

  @Get('rooms/deal/:dealId')
  findRoomByDealId(@Param('dealId', ParseIntPipe) dealId: number, @Request() req) {
    return this.chatService.findRoomByDealId(dealId, req.user.id);
  }

  @Post('rooms/:roomId/messages')
  createMessage(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req,
    @Body() createChatMessageDto: CreateChatMessageDto
  ) {
    return this.chatService.createMessage(roomId, req.user.id, createChatMessageDto);
  }

  @Get('rooms/:roomId/messages')
  getMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? Number(page) : undefined;
    const limitNum = limit ? Number(limit) : undefined;
    return this.chatService.getMessages(roomId, req.user.id, pageNum, limitNum);
  }

  @Patch('messages/:messageId/read')
  markAsRead(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Request() req,
    @Body() markAsReadDto: MarkAsReadDto
  ) {
    return this.chatService.markAsRead(messageId, req.user.id);
  }

  @Patch('rooms/:roomId/read-all')
  markAllAsRead(@Param('roomId', ParseIntPipe) roomId: number, @Request() req) {
    return this.chatService.markAllAsRead(roomId, req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.chatService.getUnreadCount(req.user.id);
  }

  @Patch('rooms/:roomId/assign-manager')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  assignManagerToRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req
  ) {
    return this.chatService.assignManagerToRoom(roomId, req.user.id);
  }
}
