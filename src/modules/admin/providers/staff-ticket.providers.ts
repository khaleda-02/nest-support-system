import { STAFF_TICKET__REPOSITORY } from 'src/common/contants';
import { StaffsTicket } from '../models/staff-ticket.model';

export const amdinProviders = [
  {
    provide: STAFF_TICKET__REPOSITORY,
    useValue: StaffsTicket,
  },
];
