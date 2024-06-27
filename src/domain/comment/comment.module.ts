import { Module } from '@nestjs/common';
import { CommentController } from './controllers';
import { CommentService } from './services';
import { ProblemModule } from '@domain/problem/problem.module';
import { CommentRepository } from './repositories';
import { UserModule } from '@domain/user/user.module';

@Module({
  imports: [ProblemModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
