import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { ticketProviders } from './providers/ticket.providers';

@Module({
  controllers: [TicketController],
  providers: [TicketService, ...ticketProviders],
})
export class TicketModule {}
