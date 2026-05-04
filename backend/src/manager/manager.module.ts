import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService, PrismaService],
  exports: [ManagerService]
})
export class ManagerModule {}

