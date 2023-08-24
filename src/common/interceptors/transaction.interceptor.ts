import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { SEQUELIZE } from '../contants';
import { Transaction, Sequelize } from 'sequelize';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private logger = new Logger(TransactionInterceptor.name);

  constructor(@Inject(SEQUELIZE) private sequelize: Sequelize) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const transaction: Transaction = await this.sequelize.transaction();
    req.transaction = transaction;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug('before commit transaction');
        transaction.commit();
      }),
      catchError((err) => {
        this.logger.debug('before rollback transaction');
        transaction.rollback();
        throw err;
      })
    );
  }
}
