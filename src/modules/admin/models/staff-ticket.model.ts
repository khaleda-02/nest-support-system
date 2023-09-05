import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { User } from 'src/modules/user/models/user.model';

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
  withTicket: {
    include: [
      {
        model: Ticket,
        attributes: { exclude: [...exculededDates] },
        where: {},
      },
    ],
    attributes: {
      exclude: [...exculededDates],
    },
  },
}))
@Table({
  underscored: true,
  paranoid: true,
  tableName: 'StaffsTickets',
  defaultScope: {
    attributes: {
      exclude: [...exculededDates],
    },
  },
})
export class StaffsTicket extends Model<StaffsTicket> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Ticket)
  @Column(NUMBER)
  ticketId: number;

  @BelongsTo(() => User)
  staff: User;

  @ForeignKey(() => User)
  @Column(NUMBER)
  staffId: number;

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
