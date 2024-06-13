import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const LeetcodeMetadata = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return context
      .switchToHttp()
      .getRequest<FastifyRequest>()
      .requestContext.get('metadata');
  },
);
