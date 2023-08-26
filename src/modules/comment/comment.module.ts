import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { commentProviders } from './providers/comment.providers';

@Module({
  controllers: [CommentController],
  providers: [CommentService, ...commentProviders],
})
export class CommentModule {}
