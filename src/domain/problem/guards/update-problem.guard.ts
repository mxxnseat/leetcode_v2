import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UpdateProblemBody } from '../schemas';
import { UserService } from '@domain/user/services';
import { ScopesService } from '@domain/auth/services';
import { scopes as leetcodeScopes } from '@config/scopes.config';
import { ForbiddenException } from '@domain/auth/exceptions';

@Injectable()
export class UpdateProblemGuard implements CanActivate {
  constructor(private readonly scopesService: ScopesService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<FastifyRequest<{ Body: UpdateProblemBody }>>();
    if (req.body.status) {
      const scopes = req.requestContext.get('scopes') as string[];
      const isAllowed = this.scopesService.verify(
        [leetcodeScopes.problem.updateStatus],
        scopes,
      );
      if (!isAllowed) {
        throw new ForbiddenException();
      }
    }
    return true;
  }
}
