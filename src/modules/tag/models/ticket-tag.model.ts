import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Tag } from './tag.model';
import { Ticket } from 'src/modules/ticket/models/ticket.model';

const { DATE, NUMBER, STRING } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'TicketTags' })
export class TicketTag extends Model<Tag> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @ForeignKey(() => Ticket)
  @Column(NUMBER)
  ticketId: number;

  @ForeignKey(() => Tag)
  @Column(NUMBER)
  tagId: number;

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
