import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { CommentService } from '../services';
import { NotFoundException } from '@lib/exception';
import { User } from '@domain/user/interfaces';
import { ForbiddenException } from '@domain/auth/exceptions';

@Injectable()
export class ProtectCommentFromUpdateGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const idComment = (req.params as { id_comment: string }).id_comment;
    const comment = await this.commentService.retrieve(idComment);
    if (!comment) {
      throw new NotFoundException();
    }
    const user = req.requestContext.get('user') as User;
    if (comment.created_by !== user.id) {
      throw new ForbiddenException();
    }
    return true;
  }
}
