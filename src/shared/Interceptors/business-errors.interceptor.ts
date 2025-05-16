import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError, BusinessLogicException } from '../errors/business-errors';



@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: BusinessLogicException | Error) => {
        if ('type' in error && error.type === BusinessError.NOT_FOUND) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        } else if (
          'type' in error &&
          error.type === BusinessError.PRECONDITION_FAILED
        ) {
          throw new HttpException(
            error.message,
            HttpStatus.PRECONDITION_FAILED,
          );
        } else if (
          'type' in error &&
          error.type === BusinessError.BAD_REQUEST
        ) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        } else if (error instanceof Error) {
          throw error;
        } else {
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }),
    );
  }
}