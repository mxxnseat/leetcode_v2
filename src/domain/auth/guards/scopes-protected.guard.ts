import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES } from '../constants';
import { FastifyRequest } from 'fastify';
import { ForbiddenException } from '../exceptions';
import { ScopesService } from '../services';

@Injectable()
export class ScopesProtectedGuard implements CanActivate {
  private readonly reflector = new Reflector();
  constructor(private readonly scopesService: ScopesService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const expectedScopes = this.getExpectedScopes(context);
    const actualScopes = req.requestContext.get('scopes') ?? [];
    const verifyResult = this.scopesService.verify(
      expectedScopes,
      actualScopes,
    );
    if (!verifyResult) {
      throw new ForbiddenException();
    }
    return true;
  }

  private getExpectedScopes(context: ExecutionContext): string[] {
    return (
      this.reflector.get(SCOPES, context.getClass()) ??
      this.reflector.get(SCOPES, context.getHandler()) ??
      []
    );
  }
}
