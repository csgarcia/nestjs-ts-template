import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return { code: 0, message: 'ok', data };
      }),
      catchError((e) => {
        console.log(e);
        let response = null;
        if (e instanceof HttpException || e instanceof BadRequestException) {
          response = e.getResponse();
          console.log({ response });
        }
        if (response && response.statusCode && response.message) {
          return throwError(
            () =>
              new BadRequestException({
                code: 0,
                message: Array.isArray(response.message)
                  ? response.message.join(', ')
                  : response.message,
                data: {},
              }),
          );
        }
        return throwError(() => e);
      }),
    );
  }
}
