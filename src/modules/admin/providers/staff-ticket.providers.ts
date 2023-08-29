import {
  STAFF_TICKET__REPOSITORY,
  // TICKET_REPOSITORY,
} from 'src/common/contants';
import { StaffsTicket } from '../models/staff-ticket.model';
import { Ticket } from 'src/modules/ticket/models/ticket.model';

export const amdinProviders = [
  {
    provide: STAFF_TICKET__REPOSITORY,
    useValue: StaffsTicket,
  },
  // {
  //   provide: TICKET_REPOSITORY,
  //   useValue: Ticket,
  // },
];
