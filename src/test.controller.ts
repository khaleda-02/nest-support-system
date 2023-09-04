import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/common/decorators/access.decorator';
import { EmailService } from './modules/email/email.service';
import { AdminService } from './modules/admin/services/admin.service';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { TransactionDecorator } from './common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { Gateway } from './modules/real-time/real-time.gateway';

@Controller('test')
export class TestController {
  constructor(
    private adminService: AdminService,
    private gateway: Gateway,
    private webSocketGateway: Gateway,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @Public()
  @Get('/')
  test(@TransactionDecorator() transaction: Transaction) {
    // return this.adminService.remove(3, transaction);
    // return this.gateway.handleMessage('8');
    // this.webSocketGateway.server
    //   .to(`ticket-${2}`)
    //   .emit('newComment', 'test test');
    // this.emailService.sendTest();
  }
}
