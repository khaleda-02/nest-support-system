import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AdminModule } from './modules/admin/admin.module';
import { CommentModule } from './modules/comment/comment.module';
import { EmailModule } from './modules/email/email.module';
import { TestController } from './test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    DatabaseModule,
    AuthModule,
    UserModule,
    TicketModule,
    AdminModule,
    CommentModule,
    EmailModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
