import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { JudgeService } from '../services/judge.service';
import { AuthProtected, CurrentUser, Scopes } from '@domain/auth/decorators';
import { scopes } from '@config/scopes.config';
import { Schemas } from '@lib/modules/core/decorators/schemas.decorator';
import {
  CreateJudgeBody,
  Judge,
  createJudgeBodyDto,
  judgeDto,
} from '../schemas';
import { User } from '@domain/user/interfaces';
import { listResponseSchema } from '@lib/modules/core/schemas';
import { List } from '@lib/modules/database/interfaces';
import { NotFoundException } from '@lib/exception';
import { LeetcodeMetadata, Metadata } from '@lib/metadata';

@Controller('judges')
@AuthProtected()
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @Get()
  @Scopes([scopes.judge.list])
  @Schemas({ response: listResponseSchema(judgeDto) })
  public async list(@CurrentUser() user: User): Promise<List<Judge>> {
    return this.judgeService.list({ user: user.id });
  }

  @Post()
  @Scopes([scopes.judge.create])
  @Schemas({
    body: createJudgeBodyDto,
    response: judgeDto,
  })
  public async create(
    @Body() payload: CreateJudgeBody,
    @CurrentUser() user: User,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<Judge> {
    return this.judgeService.create({ ...payload, user: user.id }, metadata);
  }

  @Get(':id_judge')
  @Scopes([scopes.judge.retrieve])
  @Schemas({ response: listResponseSchema(judgeDto) })
  public async retrieve(@Param('id_judge') idJudge: string): Promise<Judge> {
    const judge = await this.judgeService.retrieve(idJudge);
    if (!judge) {
      throw new NotFoundException();
    }
    return judge;
  }
}
