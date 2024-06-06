import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { SCOPES } from '../constants';
import { ScopesProtectedGuard } from '../guards/scopes-protected.guard';

export const Scopes = (
  expectedScopes: string[],
): ClassDecorator & MethodDecorator =>
  applyDecorators(
    SetMetadata(SCOPES, expectedScopes),
    UseGuards(ScopesProtectedGuard),
  );
