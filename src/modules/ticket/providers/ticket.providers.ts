import { COMMENT_REPOSITORY, TICKET_REPOSITORY } from 'src/common/contants';
import { Ticket } from '../models/ticket.model';
import { Comment } from '../models/comment.model';

export const ticketProviders = [
  {
    provide: TICKET_REPOSITORY,
    useValue: Ticket,
  },
  {
    provide: COMMENT_REPOSITORY,
    useValue: Comment,
  },
];
