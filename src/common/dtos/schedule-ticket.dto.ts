import { Type } from 'class-transformer';
import { IsDate, IsDateString, MinDate } from 'class-validator';

export class ScheduleTicketDto {
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  scheduledDate: Date;
}

// 2023-07-30T14:40:07.000Z
// Tue Aug 29 2023 13:04:05 GMT+0300
