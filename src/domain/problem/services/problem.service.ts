import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories';
import {
  ProblemCreatedEvent,
  ProblemDeletedEvent,
  ProblemUpdatedEvent,
} from '../events';
import { Problem } from '../schemas';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { CRUDService } from '@lib/crud';

@Injectable()
export class ProblemService extends CRUDService<Problem> {
  constructor(problemRepository: ProblemRepository, eventBus: EventBus) {
    super(
      {
        events: {
          created: ProblemCreatedEvent,
          updated: ProblemUpdatedEvent,
          deleted: ProblemDeletedEvent,
        },
      },
      problemRepository,
      eventBus,
    );
  }
}
