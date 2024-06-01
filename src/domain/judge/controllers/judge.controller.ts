import { Body, Controller, Post } from '@nestjs/common';
import { JudgeService } from '../services/judge.service';
import { JudgePayload } from '../interfaces/judge.interface';

@Controller('judging')
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @Post()
  public async judge(@Body() payload: JudgePayload): Promise<void> {
    await this.judgeService.judge(payload);
  }
}
