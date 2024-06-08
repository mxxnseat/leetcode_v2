import { Injectable } from '@nestjs/common';
import { CreateJudgePayload, Judge } from '../schemas';
import { JudgeRepository } from '../repositories';
import { JudgeCreatedEvent, JudgeUpdatedEvent } from '../events';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { List, ListRepositoryOptions } from '@lib/modules/database/interfaces';
import { diff } from '@lib/utils';

@Injectable()
export class JudgeService {
  constructor(
    private readonly judgeRepository: JudgeRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async list(
    options: ListRepositoryOptions<Judge>,
  ): Promise<List<Judge>> {
    return this.judgeRepository.list(options);
  }

  public async create({
    problem_id,
    algorithm,
    user,
  }: CreateJudgePayload): Promise<Judge> {
    const judge = await this.judgeRepository.create({
      algorithm,
      user,
      failed_reason: null,
      success: false,
      problem: problem_id,
    });
    this.eventBus.publish(new JudgeCreatedEvent(judge));
    return judge;
  }

  public async retrieve(idJudge: string): Promise<Judge | null> {
    return this.judgeRepository.retrieve(idJudge);
  }

  public async update(
    idJudge: string,
    payload: Partial<Judge>,
  ): Promise<Judge | null> {
    const judge = await this.retrieve(idJudge);
    if (!judge) {
      return null;
    }
    const updatedJudge = await this.judgeRepository.update(idJudge, payload);
    if (!updatedJudge) {
      return null;
    }
    this.eventBus.publish(
      new JudgeUpdatedEvent(updatedJudge, diff(judge, updatedJudge)),
    );
    return judge;
  }
}
