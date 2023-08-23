import { USER_REPOSITORY } from 'src/common/contants';
import { User } from './models/user.model';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
