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
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    DatabaseModule, // main module
    AuthModule, // main module
    UserModule, // main module
    TicketModule, // main module
    AdminModule, // main module
    // staff
    CommentModule, // made it a separated module for scalability [so we can add a replies feature in the future]
    // communication
    EmailModule,
    TagModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
