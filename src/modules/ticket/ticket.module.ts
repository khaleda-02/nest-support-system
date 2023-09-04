import { Module, forwardRef } from '@nestjs/common';
import { TicketController, CommentController } from './controllers';
import { ticketProviders } from './providers/ticket.providers';
import {
  UserTicketService,
  AdminTicketService,
  CommentService,
} from './services';
import { EmailModule } from '../email/email.module';
import { AdminModule } from '../admin/admin.module';
import { RealTimeModule } from '../real-time/real-time.module';

@Module({
  imports: [forwardRef(() => AdminModule), EmailModule, RealTimeModule],
  controllers: [TicketController, CommentController],
  providers: [
    ...ticketProviders,
    AdminTicketService,
    UserTicketService,
    CommentService,
  ],
  exports: [AdminTicketService, UserTicketService],
})
export class TicketModule {}
