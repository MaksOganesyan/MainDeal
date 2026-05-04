import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Auth()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Auth()
  findAll(@Request() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread')
  @Auth()
  findUnread(@Request() req) {
    return this.notificationsService.findUnread(req.user.id);
  }

  @Get('unread/count')
  @Auth()
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  @Auth()
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  @Auth()
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.notificationsService.delete(id, req.user.id);
  }

  @Delete()
  @Auth()
  removeAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.id);
  }
}

