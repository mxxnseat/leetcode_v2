import { BaseException } from '@lib/exception';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(BaseException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: BaseException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<FastifyReply>();
    res.status(exception.status).send({
      code: exception.code,
      message: exception.message,
    });
  }
}
