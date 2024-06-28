import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import fastifyRequestContext from '@fastify/request-context';
import { Metadata } from '@lib/metadata';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: () => randomUUID(),
    }),
    { rawBody: true, bufferLogs: true },
  );
  app.register(fastifyRequestContext as any, {
    defaultStoreValues: {
      user: null,
      scopes: [],
      metadata: new Metadata(),
    },
  });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('v1');
  await app.listen(8080);
}
bootstrap();
