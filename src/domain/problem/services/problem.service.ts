import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories';
import { ProblemCreatedEvent, ProblemUpdatedEvent } from '../events';
import { List, ListRepositoryOptions } from '@lib/modules/database/interfaces';
import { Problem } from '../schemas';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { Metadata } from '@lib/metadata';
import { diff } from '@lib/utils';

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository,
    private readonly eventBus: EventBus,
  ) {}
  public async list(
    options: ListRepositoryOptions<Problem>,
  ): Promise<List<Problem>> {
    return this.problemRepository.list(options);
  }

  public async create(payload: Problem, metadata: Metadata): Promise<Problem> {
    const problem = await this.problemRepository.create({
      ...payload,
      status: 'pending',
    });
    this.eventBus.publish(new ProblemCreatedEvent(problem, metadata));
    return problem;
  }

  public retrieve(id: string): Promise<Problem | null> {
    return this.problemRepository.retrieve(id);
  }

  public async update(
    id: string,
    payload: Partial<Problem>,
    metadata: Metadata,
  ): Promise<Problem | null> {
    const problem = await this.retrieve(id);
    if (!problem) {
      return null;
    }
    const updatedProblem = await this.problemRepository.update(id, payload);
    if (!updatedProblem) {
      return null;
    }
    this.eventBus.publish(
      new ProblemUpdatedEvent(problem, diff(updatedProblem, problem), metadata),
    );
    return updatedProblem;
  }

  public delete(id: string): Promise<Problem | null> {
    return this.problemRepository.delete(id);
  }
}
