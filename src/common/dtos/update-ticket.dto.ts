import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinDate,
} from 'class-validator';
import moment from 'moment';
import { Priority, Status } from 'src/common/enums';

export class UpdateTicketDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;

  // @IsOptional()
  // @IsDateString()
  // @MinDate(moment().utc().toDate())
  // date: Date;
}
