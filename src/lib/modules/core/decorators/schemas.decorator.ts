import { SetMetadata, applyDecorators } from '@nestjs/common';
import { SchemasOptions } from '../interfaces';
import { SCHEMAS } from '../constants';

export const Schemas = (options: SchemasOptions): MethodDecorator =>
  applyDecorators(SetMetadata(SCHEMAS, options));
