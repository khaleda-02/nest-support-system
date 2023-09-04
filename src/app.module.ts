import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmailModule } from './modules/email/email.module';
import { TestController } from './test.controller';
import { TagModule } from './modules/tag/tag.module';
import { RealTimeModule } from './modules/real-time/real-time.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300000,
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    TicketModule,
    AdminModule,
    EmailModule,
    TagModule,
    RealTimeModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
