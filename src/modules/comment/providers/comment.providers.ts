import { COMMENT_REPOSITORY } from 'src/common/contants';
import { Comment } from '../models/comment.model';

export const commentProviders = [
  {
    provide: COMMENT_REPOSITORY,
    useValue: Comment,
  },
];
