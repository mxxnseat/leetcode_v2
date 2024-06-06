import { Body, Controller, Post } from '@nestjs/common';
import { JudgeService } from '../services/judge.service';
import { JudgePayload } from '../interfaces/judge.interface';
import { AuthProtected, Scopes } from '@domain/auth/decorators';
import { scopes } from '@config/scopes.config';

@Controller('judging')
@AuthProtected()
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @Post()
  @Scopes([scopes.judge.create])
  public async judge(@Body() payload: JudgePayload): Promise<void> {
    await this.judgeService.judge(payload);
  }
}
