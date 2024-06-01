import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JudgeController } from './controllers';
import { JudgeProcessor } from './processors';
import { JudgeService } from './services';
import { ProblemModule } from '@domain/problem/problem.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'judging',
    }),
    ProblemModule,
  ],
  controllers: [JudgeController],
  providers: [JudgeProcessor, JudgeService],
})
export class JudgeModule {}
