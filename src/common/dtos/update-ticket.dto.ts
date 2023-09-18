import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ENUM } from 'sequelize';
import { Priority, Status } from 'src/common/enums';

export class UpdateTicketDto {
  @IsOptional()
  @IsNotEmpty()
  // @IsEnum(ENUM(Status.IN_PROGRESS, Status.RESOLVED, Status.CLOSED))
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Priority)
  priority?: Priority;
}
