import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories';
import { EventBus } from '@nestjs/cqrs';
import { Problem } from '../interfaces';
import { ProblemCreatedEvent } from '../events';

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository,
    private readonly eventBus: EventBus,
  ) {}

  public create(payload: Problem): Problem {
    const problem = this.problemRepository.create(payload);
    this.eventBus.publish(
      new ProblemCreatedEvent({ ...payload, status: 'pending' }),
    );
    return problem;
  }

  public retrieve(id: number): Problem | null {
    return this.problemRepository.retrieve(id);
  }
}
