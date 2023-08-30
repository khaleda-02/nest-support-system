import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/common/contants';
import { User } from '../user/models/user.model';
import { Ticket } from '../ticket/models/ticket.model';
import { Comment } from '../ticket/models/comment.model';
import { Email } from '../email/models/email.model';
import { Tag } from '../tag/models/tag.model';
import { TicketTag } from '../tag/models/ticket-tag.model';
import { StaffsTicket } from '../admin/models/staff-ticket.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get('database');
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Ticket,
        Comment,
        Email,
        Tag,
        TicketTag,
        StaffsTicket,
      ]);
      return sequelize;
    },

    inject: [ConfigService],
  },
];
