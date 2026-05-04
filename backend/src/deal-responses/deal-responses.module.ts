import { Module } from '@nestjs/common';
import { DealResponsesController } from './deal-responses.controller';
import { DealResponsesService } from './deal-responses.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DealResponsesController],
  providers: [DealResponsesService, PrismaService],
  exports: [DealResponsesService],
})
export class DealResponsesModule {}

