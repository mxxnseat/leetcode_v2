import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JudgeController } from './controllers';
import { JudgeService } from './services';
import { ProblemModule } from '@domain/problem/problem.module';
import { UserModule } from '@domain/user/user.module';
import { AuthModule } from '@domain/auth/auth.module';
import { JudgeRepository } from './repositories';
import { JudgeSaga } from './sagas';
import { JudgeHandler } from './commands/handlers';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BullModule.registerQueue({
      name: 'judging',
    }),
    ProblemModule,
  ],
  controllers: [JudgeController],
  providers: [JudgeHandler, JudgeRepository, JudgeService, JudgeSaga],
})
export class JudgeModule {}
