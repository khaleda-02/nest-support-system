import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { ticketProviders } from './providers/ticket.providers';
import { UserTicketService, AdminTicketService } from './services';

@Module({
  controllers: [TicketController],
  providers: [...ticketProviders, AdminTicketService, UserTicketService],
  exports: [AdminTicketService],
})
export class TicketModule {}
