import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { ticketProviders } from './providers/ticket.providers';
import { UserTicketService, AdminTicketService } from './services';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [TicketController],
  providers: [...ticketProviders, AdminTicketService, UserTicketService],
  exports: [AdminTicketService],
})
export class TicketModule {}
