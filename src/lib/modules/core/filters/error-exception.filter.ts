import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<FastifyReply>();
    res.status(500).send({
      code: 'internal_server',
      message: exception.message,
    });
  }
}
