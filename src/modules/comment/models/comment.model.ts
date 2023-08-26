import { ENUM } from 'sequelize';
import {
  DataType,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';

const { NUMBER, STRING } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'Comments' })
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Column(STRING)
  content: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column(NUMBER)
  userId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Ticket)
  @Column(NUMBER)
  ticketId: number;
}
