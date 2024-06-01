import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: () => randomUUID(),
    }),
  );
  app.setGlobalPrefix('v1');
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(8080);
}
bootstrap();
