import { Controller, Post } from '@nestjs/common';
import { AuthProtected, Scopes } from '@domain/auth/decorators';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { featuresConfig } from '@config/features.config';
import { AuthModule } from '@domain/auth/auth.module';
import { createUser } from 'tests/integration/seeds';
import { expect } from 'chai';
import { clearAll } from 'tests/integration/core';
import { UserModule } from '@domain/user/user.module';
import { DatabaseModule } from '@lib/modules/database/database.module';
import { databaseConfig } from '@config/database.config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyRequestContext from '@fastify/request-context';
import { HttpExceptionFilter } from '@lib/modules/core/filters';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { scopesConfig } from '@config/scopes.config';
import { Metadata } from '@lib/metadata';
import { auth0Config } from '@config/auth0.config';

@Controller('test')
class testController {
  @Post('auth')
  @AuthProtected()
  public authProtected(): void {}

  @Post('scopes')
  @Scopes(['test:scope'])
  public scopesProtected(): void {}
}

describe('AuthProtected', () => {
  let request: TestAgent;
  let app: NestFastifyApplication;
  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [auth0Config, featuresConfig, databaseConfig, scopesConfig],
          isGlobal: true,
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
      ],
      controllers: [testController],
    }).compile();
    app = moduleRef.createNestApplication(new FastifyAdapter());
    request = supertest(app.getHttpAdapter().getInstance().server);
    app.register(fastifyRequestContext as any, {
      defaultStoreValues: {
        user: null,
        scopes: [],
        metadata: new Metadata(),
      },
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  it("should allow access if 'dev-user-id' header is passed and auth_enabled ff is false", async function () {
    const testUser = await createUser();
    const { status } = await request
      .post('/test/auth')
      .set('dev-user-id', testUser.id);
    expect(status).eq(201);
  });
  it("should not allow access if 'dev-user-id' header is passed and auth_enabled ff is false", async () => {
    const { status, body } = await request.post('/test/auth');
    expect(status).eq(401);
    expect(body.code).eq('not_authorized');
  });
  it("should not allow access if user doesn't have expected scopes", async () => {
    const { status, body } = await request.post('/test/scopes');
    expect(status).eq(403);
    expect(body.code).eq('forbidden');
  });

  afterEach(() => clearAll());
  after(() => app.close());
});
