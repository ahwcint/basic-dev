import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ConcertModule } from './modules/concert/concert.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { WebSocketModule } from './modules/web-socket/web-socket.module';

@Module({
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConcertModule,
    WebSocketModule,
  ],
})
export class AppModule {}
