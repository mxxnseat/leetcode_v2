import { Module } from '@nestjs/common';
import { ProblemController } from './controllers';
import { ProblemRepository } from './repositories';
import { ProblemService } from './services';
import { AuthModule } from '@domain/auth/auth.module';
import { UserModule } from '@domain/user/user.module';
import { UpdateProblemGuard } from './guards';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [ProblemController],
  providers: [ProblemRepository, ProblemService, UpdateProblemGuard],
  exports: [ProblemService],
})
export class ProblemModule {}
