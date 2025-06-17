import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ConcertModule } from './modules/concert/concert.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, ConcertModule],
})
export class AppModule {}
