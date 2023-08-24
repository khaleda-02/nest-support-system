import { ENUM } from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { Priority, Status } from 'src/common/enums';

const { DATE, NUMBER, STRING, BOOLEAN } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'Tickets' })
export class Ticket extends Model<Ticket> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Column(NUMBER)
  userId: number;

  @Column(
    ENUM(
      Status.OPEN,
      Status.ASSIGNED,
      Status.SCHEDULED,
      Status.IN_PROGRESS,
      Status.RESOLVED,
      Status.CLOSED,
    ),
  )
  status: string;

  @Column(STRING)
  title: string;

  @Column(STRING)
  description: string;

  @Column(DATE)
  scheduledDate: Date;

  @Column(ENUM(Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL))
  priority: string;

  @Column(STRING)
  feedback: string;

  @Column(NUMBER)
  categoryId: number;

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
