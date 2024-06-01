import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '@lib/database/database.module';
import { UserModule } from '@domain/user/user.module';
import { JudgeModule } from '@domain/judge/judge.module';
import { ProblemModule } from '@domain/problem/problem.module';
import { WebsocketModule } from '@domain/websocket/websocket.module';

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
