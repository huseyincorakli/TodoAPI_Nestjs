import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    
    return next
      .handle()
      .pipe(
        tap(() => console.log(`####-${controller}-${handler} ---- ${(Date.now()-now)/1000} s`)
        ),
      );
  }
}
