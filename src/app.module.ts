import { Module } from '@nestjs/common';
import { UserModule } from '@domain/user/user.module';
import { JudgeModule } from '@domain/judge/judge.module';
import { ProblemModule } from '@domain/problem/problem.module';
import { WebsocketModule } from '@domain/websocket/websocket.module';
import { CoreModule } from '@lib/modules/core/core.module';
import { AuthModule } from '@domain/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    UserModule,
    JudgeModule,
    ProblemModule,
    WebsocketModule,
  ],
})
export class AppModule {}
