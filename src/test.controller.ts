import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/common/decorators/access.decorator';
import { EmailService } from './modules/email/email.service';
import { AdminService } from './modules/admin/services/admin.service';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { TransactionDecorator } from './common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('test')
export class TestController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(TransactionInterceptor)
  @Public()
  @Get('/')
  test(@TransactionDecorator() transaction: Transaction) {
    return this.adminService.remove(3, transaction);
    // this.emailService.sendTest();
  }
}
