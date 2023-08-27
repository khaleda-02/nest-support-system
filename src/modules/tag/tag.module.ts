import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { tagProviders } from './providers/tag.providers';

@Module({
  controllers: [TagController],
  providers: [TagService, ...tagProviders],
})
export class TagModule {}
