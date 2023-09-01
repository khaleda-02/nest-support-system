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
  Scopes,
} from 'sequelize-typescript';
import { Role, UserStatus } from 'src/common/enums';
import { StaffsTicket } from 'src/modules/admin/models/staff-ticket.model';
import { Comment } from 'src/modules/ticket/models/comment.model';
import { Email } from 'src/modules/email/models/email.model';

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
  login: {
    attributes: {
      exclude: [...exculededDates, 'otp', 'otpExpiry'], // get all attributes for admins
    },
  },
}))
@Table({
  underscored: true,
  paranoid: true,
  tableName: 'Users',
  defaultScope: {
    attributes: {
      exclude: [...exculededDates, 'password'],
    },
  },
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Unique
  @Column(STRING)
  username: string;

  @Unique
  @Column(STRING)
  email: string;

  @Column(STRING)
  firstname: string;

  @Column(STRING)
  lastname: string;

  @Column(NUMBER)
  phoneNumber: string;

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

  //! StaffTicket association
  @HasMany(() => StaffsTicket)
  staffsTicket: StaffsTicket[];

  @HasMany(() => Email)
  emails: Email[];

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
