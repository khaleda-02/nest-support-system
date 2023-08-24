import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/access.decorator';
import { MailService } from './modules/mail/mail.service';

@Controller('test')
export class TestController {
  constructor(private mailService: MailService) {}

  @Public()
  @Get('/')
  test() {
    this.mailService.sendTest();
  }
}
