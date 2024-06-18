import { Auth0Config, auth0Config } from '@config/auth0.config';
import { FeaturesConfig, featuresConfig } from '@config/features.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  ManagementClient,
  GetUsers200ResponseOneOfInner,
  ApiResponse,
  UserCreate,
} from 'auth0';

@Injectable()
export class Auth0Service {
  private readonly managementClient: ManagementClient;
  constructor(
    @Inject(auth0Config.KEY) public readonly ac: Auth0Config,
    @Inject(featuresConfig.KEY) private readonly fc: FeaturesConfig,
  ) {
    if (this.validateConfig(this.ac)) {
      throw new Error(
        'Cannot start application because auth0 management api properties were not passed',
      );
    }
    this.managementClient = new ManagementClient({
      domain: this.ac.domain as string,
      audience: this.ac.audience as string,
      clientId: this.ac.clientId as string,
      clientSecret: this.ac.clientSecret as string,
    });
  }

  public async createUser(
    body: Omit<UserCreate, 'connection'>,
  ): Promise<ApiResponse<GetUsers200ResponseOneOfInner>> {
    return this.managementClient.users.create({
      connection: this.ac.connection as string,
      ...body,
    });
  }

  // TODO: Fix using config is TYPE
  private validateConfig(config: Auth0Config): boolean {
    return (
      (!this.ac.audience ||
        !this.ac.clientId ||
        !this.ac.clientSecret ||
        !this.ac.domain ||
        !this.ac.connection) &&
      this.fc.authEnabled
    );
  }
}
