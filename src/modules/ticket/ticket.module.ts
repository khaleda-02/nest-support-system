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

@Module({
  imports: [EmailModule, forwardRef(() => AdminModule)],
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
