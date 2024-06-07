import { Value } from '@sinclair/typebox/value';

import { TypeCompiler } from '@sinclair/typebox/compiler';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map, pipe } from 'rxjs';
import { SCHEMAS } from '../constants';
import { FastifyRequest } from 'fastify';
import { SchemasOptions } from '../interfaces';
import Ajv, { ErrorObject } from 'ajv';
import { BadRequestException } from '@lib/exception';
import { TObject } from '@sinclair/typebox';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private readonly reflector = new Reflector();
  private readonly ajv = new Ajv({ removeAdditional: true, allErrors: true });
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const schemas = this.reflector.get(
      SCHEMAS,
      context.getHandler(),
    ) as SchemasOptions;
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    if (schemas) {
      this.validate(schemas.body, req.body);
      this.validate(schemas.query, req.query);
    }

    return next.handle().pipe(
      map((data) => {
        if (schemas && schemas.response) {
          const validate = this.ajv.compile(schemas.response);
          validate(data);
        }
        return data;
      }),
    );
  }
  private validate(object: TObject | undefined, payload: unknown): void {
    if (object) {
      const validate = this.ajv.compile(object);
      const isValid = validate(payload);
      if (!isValid) {
        throw new BadRequestException(validate.errors as ErrorObject[]);
      }
    }
  }
}
