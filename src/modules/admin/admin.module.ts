import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import {
  AdminStaffController,
  AdminTicketController,
  StaffController,
} from './controllers';
import { amdinProviders } from './providers/staff-ticket.providers';
import { AdminService } from './services/admin.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
@Module({
  imports: [TicketModule, UserModule, EmailModule],
  controllers: [AdminTicketController, AdminStaffController, StaffController],
  providers: [AdminService, ...amdinProviders],
})
export class AdminModule {}
