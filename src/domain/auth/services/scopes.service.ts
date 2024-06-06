import { ScopesConfig, scopesConfig } from '@config/scopes.config';
import { UserRole } from '@domain/user/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ScopesService {
  constructor(
    @Inject(scopesConfig.KEY)
    private readonly sc: ScopesConfig,
  ) {}
  public verify(expectedScopes: string[], actualScopes: string[]): boolean {
    return expectedScopes.every((s) => actualScopes.includes(s));
  }
  public attachScopes(req: FastifyRequest, scopes: readonly string[]): void {
    const existScopes = req.requestContext.get('scopes') ?? [];
    req.requestContext.set('scopes', [...new Set([...existScopes, ...scopes])]);
  }
  public getScopesByRole(role: UserRole): readonly string[] {
    return this.sc[role];
  }
}
