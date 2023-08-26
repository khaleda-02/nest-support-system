import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/access.decorator';
import { EmailService } from './modules/email/email.service';

@Controller('test')
export class TestController {
  constructor(private emailService: EmailService) {}

  @Public()
  @Get('/')
  test() {
    // this.emailService.sendTest();
  }
}
