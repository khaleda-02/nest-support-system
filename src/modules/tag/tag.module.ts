import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { tagProviders } from './providers/tag.providers';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TicketModule],
  controllers: [TagController],
  providers: [TagService, ...tagProviders],
})
export class TagModule {}
