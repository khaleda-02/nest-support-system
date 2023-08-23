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
import { Roles } from 'src/common/enums';

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
  password: string;

  @Column(BOOLEAN)
  verified: boolean;

  @Column(STRING)
  otp: string;

  @Column(DATE)
  otpExpiry: Date;

  @Column(ENUM(Roles.ADMIN, Roles.USER, Roles.STAFF))
  roles: string;

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
