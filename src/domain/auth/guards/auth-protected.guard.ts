import { FeaturesConfig, featuresConfig } from '@config/features.config';
import { UserService } from '@domain/user/services';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { NotAuthorizedException } from '../exceptions';
import { ScopesService } from '../services';
import { Metadata } from '@lib/metadata';
import { Auth0Config, auth0Config } from '@config/auth0.config';

@Injectable()
export class AuthProtectedGuard implements CanActivate {
  constructor(
    @Inject(auth0Config.KEY)
    private readonly ac: Auth0Config,
    @Inject(featuresConfig.KEY)
    private readonly fc: FeaturesConfig,
    private readonly userService: UserService,
    private readonly scopesService: ScopesService,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    if (!this.fc.authEnabled) {
      return this.authDevUser(req);
    }
    const token = req.headers.authorization;
    if (!token) {
      throw new NotAuthorizedException();
    }
    // TODO: Check audience
    const decoded = jwt.verify(token, this.ac.public_key as string);
    console.log({ decoded });
    const {
      data: [user],
    } = await this.userService.list({ sub: decoded.sub });
    req.requestContext.set('user', user);
    const metadata = req.requestContext.get('metadata') as Metadata;
    req.requestContext.set('metadata', metadata.setUser(user.id));
    this.scopesService.attachScopes(
      req,
      this.scopesService.getScopesByRole(user.role),
    );
    return true;
  }
  private async authDevUser(req: FastifyRequest): Promise<boolean> {
    const devUserId = req.headers['dev-user-id'] as string | undefined;
    if (!devUserId) {
      throw new NotAuthorizedException();
    }
    const user = await this.userService.retrieve(devUserId);
    if (!user) {
      throw new NotAuthorizedException();
    }
    const metadata = req.requestContext.get('metadata') as Metadata;
    req.requestContext.set('metadata', metadata.setUser(user.id));
    req.requestContext.set('user', user);
    this.scopesService.attachScopes(
      req,
      this.scopesService.getScopesByRole(user.role),
    );
    return true;
  }
}
