import { Module } from '@nestjs/common';
import { ProblemController } from './controllers';
import { ProblemRepository } from './repositories';
import { ProblemService } from './services';

@Module({
  controllers: [ProblemController],
  providers: [ProblemRepository, ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}
