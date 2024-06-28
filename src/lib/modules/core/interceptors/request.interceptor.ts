import { Metadata } from '@lib/metadata';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

export class RequestInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    (req.requestContext.get('metadata') as Metadata).setTraceId(req.id);
    return next.handle();
  }
}
