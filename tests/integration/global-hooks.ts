import * as supertest from 'supertest';
import fastifyRequestContext from '@fastify/request-context';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { clearAll } from './core';
import { AppModule } from 'src/app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { HttpExceptionFilter } from '@lib/modules/core/filters';

export let app: NestFastifyApplication;
export let request: supertest.Agent;
export const mochaHooks = {
  beforeAll: async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication(new FastifyAdapter(), {
      rawBody: true,
    });
    app.register(fastifyRequestContext as any, {
      defaultStoreValues: {
        user: null,
        scopes: [],
      },
    });
    app.useWebSocketAdapter(new WsAdapter(app));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    request = supertest.agent(app.getHttpAdapter().getInstance().server);
  },
  after: () => app.close(),
  afterEach: () => clearAll(),
};
