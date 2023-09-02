import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';
import { TicketTag } from './ticket-tag.model';

const { DATE, NUMBER, STRING, BOOLEAN } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'Tags' })
export class Tag extends Model<Tag> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Column(STRING)
  name: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column(NUMBER)
  userId: number;

  @HasMany(() => TicketTag)
  TicketTags: TicketTag[];


  @Column(DATE)
  createdAt: Date;

  @Column(STRING)
  createdBy: string;

  @Column(DATE)
  updatedAt: Date;

  @Column(STRING)
  updatedBy: string;

  @Column(DATE)
  deletedAt: Date;

  @Column(STRING)
  deletedBy: string;
}
