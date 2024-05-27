import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JudgeController } from './controllers/judge.controller';
import { JudgeProcessor } from './processors/judge.processor';
import { JudgeService } from './services/judge.service';
import { ProblemModule } from 'src/problem';

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
