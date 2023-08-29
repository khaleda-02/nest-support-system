import { TAG_REPOSITORY, TICKET_TAG_REPOSITORY } from 'src/common/contants';
import { Tag } from '../models/tag.model';
import { TicketTag } from '../models/ticket-tag.model';

export const tagProviders = [
  {
    provide: TAG_REPOSITORY,
    useValue: Tag,
  },
  {
    provide: TICKET_TAG_REPOSITORY,
    useValue: TicketTag,
  },
];
