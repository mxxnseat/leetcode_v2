import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    context
      .switchToHttp()
      .getRequest<FastifyRequest>()
      .requestContext.get('user'),
);
