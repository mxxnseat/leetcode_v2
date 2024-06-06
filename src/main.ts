import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import fastifyRequestContext from '@fastify/request-context';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: () => randomUUID(),
    }),
    { rawBody: true },
  );
  app.register(fastifyRequestContext as any, {
    defaultStoreValues: {
      user: null,
      scopes: [],
    },
  });
  app.setGlobalPrefix('v1');
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(8080);
}
bootstrap();
