import { Injectable } from '@nestjs/common';
import { Judge } from '../schemas';
import { JudgeRepository } from '../repositories';
import { JudgeCreatedEvent, JudgeUpdatedEvent } from '../events';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { CRUDService } from '@lib/crud';

@Injectable()
export class JudgeService extends CRUDService<Judge> {
  constructor(judgeRepository: JudgeRepository, eventBus: EventBus) {
    super(
      { events: { created: JudgeCreatedEvent, updated: JudgeUpdatedEvent } },
      judgeRepository,
      eventBus,
    );
  }
}
