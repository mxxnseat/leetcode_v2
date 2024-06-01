import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JudgeModule } from './domain/judge';
import { WebsocketModule } from './domain/websocket';
import { CqrsModule } from '@nestjs/cqrs';
import { ProblemModule } from './domain/problem';
import { DatabaseModule } from './lib/database';
import { UserModule } from '@domain/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    CqrsModule.forRoot(),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6380 },
    }),
    UserModule,
    JudgeModule,
    ProblemModule,
    WebsocketModule,
  ],
})
export class AppModule {}
