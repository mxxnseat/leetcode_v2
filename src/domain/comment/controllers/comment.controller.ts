import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../services';
import { List, ListRepositoryOptions } from '@lib/modules/database/interfaces';
import {
  Comment,
  CreateCommentBodyDto,
  UpdateCommentBodyDto,
  createCommentBodySchema,
  updateCommentBodySchema,
} from '../schemas';
import { AuthProtected, CurrentUser, Scopes } from '@domain/auth/decorators';
import { scopes } from '@config/scopes.config';
import { Schemas } from '@lib/modules/core/decorators';
import { User } from '@domain/user/interfaces';
import { LeetcodeMetadata, Metadata } from '@lib/metadata';
import { ProblemService } from '@domain/problem/services';
import { NotFoundException } from '@lib/exception';
import { ProtectCommentFromUpdateGuard } from '../guards';

@Controller('comments')
@AuthProtected()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly problemService: ProblemService,
  ) {}

  @Get()
  @Scopes([scopes.comment.list])
  public list(
    @Query() options: ListRepositoryOptions<Comment>,
  ): Promise<List<Comment>> {
    return this.commentService.list(options);
  }

  @Post()
  @HttpCode(201)
  @Schemas({ body: createCommentBodySchema })
  @Scopes([scopes.comment.create])
  public async create(
    @Body() body: CreateCommentBodyDto,
    @CurrentUser() user: User,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<Comment> {
    const problem = await this.problemService.retrieve(body.problem_id);
    if (!problem) {
      throw new NotFoundException();
    }
    return this.commentService.create(
      {
        created_by: user.id,
        text: body.text,
        problem: body.problem_id,
      },
      metadata,
    );
  }

  @Patch(':id_comment')
  @Schemas({ body: updateCommentBodySchema })
  @UseGuards(ProtectCommentFromUpdateGuard)
  @Scopes([scopes.comment.update])
  public async update(
    @Param('id_comment') idComment: string,
    @Body() payload: UpdateCommentBodyDto,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<Comment> {
    const comment = await this.commentService.update(
      idComment,
      payload,
      metadata,
    );
    if (comment) {
      return comment;
    }
    throw new NotFoundException();
  }

  @Delete(':id_comment')
  @HttpCode(204)
  @UseGuards(ProtectCommentFromUpdateGuard)
  @Scopes([scopes.comment.delete])
  public async delete(
    @Param('id_comment') idComment: string,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<void> {
    const comment = await this.commentService.delete(idComment, metadata);
    if (!comment) {
      throw new NotFoundException();
    }
  }
}
