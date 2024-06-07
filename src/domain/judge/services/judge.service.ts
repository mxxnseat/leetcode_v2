import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JUDGING_QUEUE_NAME } from '../constants';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { CreateJudgeBody } from '../schemas';

@Injectable()
export class JudgeService {
  constructor(
    @InjectQueue(JUDGING_QUEUE_NAME)
    private readonly judgingQueue: Queue<CreateJudgeBody>,
  ) {}

  public async judge(payload: CreateJudgeBody): Promise<void> {
    await this.judgingQueue.add(randomUUID(), payload);
  }
}
