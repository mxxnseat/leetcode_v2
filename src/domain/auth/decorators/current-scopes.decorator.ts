import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const CurrentScopes = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    context
      .switchToHttp()
      .getRequest<FastifyRequest>()
      .requestContext.get('scopes'),
);
