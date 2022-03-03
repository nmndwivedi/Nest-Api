import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    // Local
    AuthModule,
    UserModule,
    // Global
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BookmarkModule,
    ScheduleModule.forRoot(),
    CronModule
  ],
})
export class AppModule {}
