import { ENUM } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
  Unique,
  Model,
  AutoIncrement,
} from 'sequelize-typescript';
import { Role, UserStatus } from 'src/common/enums';
import { Comment } from 'src/modules/comment/models/comment.model';
import { Ticket } from 'src/modules/ticket/models/ticket.model';

const { DATE, NUMBER, STRING, BOOLEAN } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'Users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Unique
  @Column(STRING)
  username: string;

  @Column(STRING)
  email: string;

  @Column(STRING)
  firstname: string;

  @Column(STRING)
  lastname: string;

  @Column(NUMBER)
  phoneNumber: number;

  @Column(STRING)
  password: string;

  @Column(ENUM(UserStatus.ACTIVE, UserStatus.DES_ACTIVE, UserStatus.PENDING))
  status: UserStatus;

  @Column(STRING)
  otp: string;

  @Column(DATE)
  otpExpiry: Date;

  @Column(ENUM(Role.ADMIN, Role.USER, Role.STAFF))
  roles: Role;

  @HasMany(() => Comment)
  comments: Comment[];

  @Column(DATE)
  createdAt: Date;

  @Column(DATE)
  updatedAt: Date;

  @Column(STRING)
  updatedBy: string;

  @Column(DATE)
  deletedAt: Date;

  @Column(STRING)
  deletedBy: string;
}
