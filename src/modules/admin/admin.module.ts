import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import { AdminStaffController, AdminTicketController } from './controllers';
@Module({
  imports: [TicketModule],
  controllers: [AdminTicketController, AdminStaffController],
  providers: [],
})
export class AdminModule {}
