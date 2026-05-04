import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { ContentFilterModule } from '../utils/content-filter.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ContentFilterModule, NotificationsModule],
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
  exports: [ChatService],
})
export class ChatModule {}
