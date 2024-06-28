import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorExceptionFilter, HttpExceptionFilter } from './filters';
import { ConfigModule } from '@nestjs/config';
import { BullmqConfig, bullmqConfig } from '@config/bullmq.config';
import { databaseConfig } from '@config/database.config';
import { featuresConfig } from '@config/features.config';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../database/database.module';
import { scopesConfig } from '@config/scopes.config';
import { RequestInterceptor, ValidationInterceptor } from './interceptors';
import { CqrsModule } from '../cqrs/cqrs.module';
import { stompConfig } from '@config/stomp.config';
import { StompModule } from '../stomp/stomp.module';
import { auth0Config } from '@config/auth0.config';
import { appConfig } from '@config/app.config';
import { LoggerModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [
    StompModule.forRoot(),
    DatabaseModule,
    LoggerModule,
    CqrsModule.forRoot(),
    BullModule.forRootAsync({
      inject: [bullmqConfig.KEY],
      useFactory: async (bc: BullmqConfig) => ({
        connection: { host: bc.host, port: bc.port, db: bc.db },
      }),
    }),
    ConfigModule.forRoot({
      load: [
        appConfig,
        databaseConfig,
        bullmqConfig,
        featuresConfig,
        scopesConfig,
        stompConfig,
        auth0Config,
      ],
      isGlobal: true,
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class CoreModule {}
