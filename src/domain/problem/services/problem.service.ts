import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories';
import { EventBus } from '@nestjs/cqrs';
import { Problem } from '../interfaces';
import { ProblemCreatedEvent } from '../events';
import { List, ListRepositoryOptions } from '@lib/modules/database/interfaces';

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

  public async create(payload: Problem): Promise<Problem> {
    const problem = await this.problemRepository.create({
      ...payload,
      status: 'pending',
    });
    this.eventBus.publish(new ProblemCreatedEvent(problem));
    return problem;
  }

  public retrieve(id: string): Promise<Problem | null> {
    return this.problemRepository.retrieve(id);
  }

  public update(
    id: string,
    payload: Partial<Problem>,
  ): Promise<Problem | null> {
    return this.problemRepository.update(id, payload);
  }

  public delete(id: string): Promise<Problem | null> {
    return this.problemRepository.delete(id);
  }
}
