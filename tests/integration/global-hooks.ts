import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import * as supertest from 'supertest';
import fastifyRequestContext from '@fastify/request-context';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { clearAll } from './core';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from '@lib/modules/core/filters';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { Metadata } from '@lib/metadata/metadata';

chai.use(sinonChai);

export let sinonSandbox = createSandbox();
export let app: NestFastifyApplication;
export let request: supertest.Agent;
export const mochaHooks = {
  beforeAll: async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    });
    const stubEventBus = sinonSandbox.createStubInstance(EventBus);
    moduleRef.overrideProvider(EventBus).useValue(stubEventBus);

    app = (await moduleRef.compile()).createNestApplication(
      new FastifyAdapter(),
      {
        rawBody: true,
      },
    );
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
    request = supertest.agent(app.getHttpAdapter().getInstance().server);
  },
  after: async () => {
    sinonSandbox.restore();
    await app.close();
  },
  afterEach: async () => {
    sinonSandbox.reset();
    clearAll();
  },
};
