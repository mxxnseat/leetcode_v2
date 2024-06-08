import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorExceptionFilter, HttpExceptionFilter } from './filters';
import { ConfigModule } from '@nestjs/config';
import { BullmqConfig, bullmqConfig } from '@config/bullmq.config';
import { clerkConfig } from '@config/clerk.config';
import { databaseConfig } from '@config/database.config';
import { featuresConfig } from '@config/features.config';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../database/database.module';
import { ClerkModule } from '../clerk/clerk.module';
import { scopesConfig } from '@config/scopes.config';
import { ValidationInterceptor } from './interceptors';
import { CqrsModule } from '../cqrs/cqrs.module';

@Global()
@Module({
  imports: [
    ClerkModule,
    DatabaseModule,
    CqrsModule.forRoot(),
    BullModule.forRootAsync({
      inject: [bullmqConfig.KEY],
      useFactory: async (bc: BullmqConfig) => ({
        connection: { host: bc.host, port: bc.port, db: bc.db },
      }),
    }),
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        bullmqConfig,
        clerkConfig,
        featuresConfig,
        scopesConfig,
      ],
      isGlobal: true,
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class CoreModule {}
