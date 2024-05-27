import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JudgeModule } from './judge';
import { WebsocketModule } from './websocket';
import { CqrsModule } from '@nestjs/cqrs';
import { ProblemModule } from './problem';

@Module({
  imports: [
    CqrsModule.forRoot(),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6380 },
    }),
    JudgeModule,
    ProblemModule,
    WebsocketModule,
  ],
})
export class AppModule {}
