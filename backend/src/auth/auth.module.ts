import { PrismaService } from '@/prisma.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, RefreshTokenService],
})
export class AuthModule {}
