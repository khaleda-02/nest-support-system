import { Module, forwardRef } from '@nestjs/common';
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
import { RealTimeModule } from '../real-time/real-time.module';
@Module({
  imports: [
    forwardRef(() => TicketModule),
    UserModule,
    EmailModule,
    RealTimeModule,
  ],
  controllers: [AdminTicketController, AdminStaffController, StaffController],
  providers: [AdminService, ...amdinProviders],
  exports: [AdminService],
})
export class AdminModule {}
