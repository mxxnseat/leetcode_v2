import { AppConfig, appConfig } from '@config/app.config';
import { Global, Module } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Params, LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (ac: AppConfig) => {
        return {
          pinoHttp: {
            transport:
              ac.environment === 'development'
                ? {
                    target: 'pino-pretty',
                  }
                : undefined,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
