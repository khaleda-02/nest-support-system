import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinDate,
} from 'class-validator';
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

  @IsOptional()
  @IsDateString()
  @MinDate(new Date())
  date: Date;
}
