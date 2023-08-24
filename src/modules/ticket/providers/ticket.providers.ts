import { TICKET_REPOSITORY } from 'src/common/contants';
import { Ticket } from '../models/ticket.model';

export const ticketProviders = [
  {
    provide: TICKET_REPOSITORY,
    useValue: Ticket,
  },
];
