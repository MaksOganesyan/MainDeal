import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EquipmentModule } from './equipment/equipment.module';
import { DealsModule } from './deals/deals.module';
import { ChatModule } from './chat/chat.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ManagerModule } from './manager/manager.module';
import { ContentFilterModule } from './utils/content-filter.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { DealResponsesModule } from './deal-responses/deal-responses.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContentFilterModule,
    AuthModule,
    UserModule,
    EquipmentModule,
    DealsModule,
    ChatModule,
    PortfolioModule,
    ProfilesModule,
    AnnouncementsModule,
    ComplaintsModule,
    NotificationsModule,
    ManagerModule,
    HealthModule,
    UploadModule,
    DealResponsesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
