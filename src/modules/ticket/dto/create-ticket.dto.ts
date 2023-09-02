import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Priority } from 'src/common/enums';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
