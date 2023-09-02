import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Tag } from './tag.model';
import { Ticket } from 'src/modules/ticket/models/ticket.model';

const { DATE, NUMBER, STRING } = DataType;
const exculededDates = [
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'deletedAt',
  'deletedBy',
];

@Scopes(() => ({
  withTag: {
    include: [{ model: Tag, attributes: ['id', 'name'] }],
    attributes: {
      exclude: [...exculededDates],
    },
  },
  withTicket: {
    include: [{ model: Ticket, attributes: ['id', 'name'] }],
    attributes: {
      exclude: [...exculededDates],
    },
  },
}))
@Table({
  underscored: true,
  paranoid: true,
  tableName: 'TicketsTags',
  defaultScope: {
    attributes: {
      exclude: [...exculededDates],
    },
  },
})
export class TicketTag extends Model<TicketTag> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Ticket)
  @Column(NUMBER)
  ticketId: number;

  @BelongsTo(() => Tag)
  tag: Tag;

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
