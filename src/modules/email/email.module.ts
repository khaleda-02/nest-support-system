import { Global, Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  // imports: [UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
