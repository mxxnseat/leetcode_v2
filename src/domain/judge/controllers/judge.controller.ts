import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JudgeService } from '../services/judge.service';
import { AuthProtected, Scopes } from '@domain/auth/decorators';
import { scopes } from '@config/scopes.config';
import { Schemas } from '@lib/modules/core/decorators/schemas.decorator';
import { CreateJudgeBody, createJudgeBodyDto } from '../schemas';

@Controller('judging')
@AuthProtected()
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @Post()
  @HttpCode(204)
  @Scopes([scopes.judge.create])
  @Schemas({
    body: createJudgeBodyDto,
  })
  public async judge(@Body() payload: CreateJudgeBody): Promise<void> {
    await this.judgeService.judge(payload);
  }
}
