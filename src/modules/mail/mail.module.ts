import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
