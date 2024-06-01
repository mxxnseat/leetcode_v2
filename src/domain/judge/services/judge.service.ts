import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JUDGING_QUEUE_NAME } from '../constants';
import { Queue } from 'bullmq';
import { JudgePayload } from '../interfaces/judge.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class JudgeService {
  constructor(
    @InjectQueue(JUDGING_QUEUE_NAME)
    private readonly judgingQueue: Queue<JudgePayload>,
  ) {}

  public async judge(payload: JudgePayload): Promise<void> {
    await this.judgingQueue.add(randomUUID(), payload);
  }
}
