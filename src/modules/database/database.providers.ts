import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/common/contants';
import { User } from '../user/models/user.model';
import { Ticket } from '../ticket/models/ticket.model';
import { Comment } from '../comment/models/comment.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get('database');
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Ticket, Comment]);
      return sequelize;
    },

    inject: [ConfigService],
  },
];
