import { JUDGING_QUEUE_NAME } from '@domain/judge/constants';
import { Judge } from '@domain/judge/schemas';
import { Queue } from '@lib/modules/cqrs/decorators';

@Queue(JUDGING_QUEUE_NAME)
export class JudgeCommand {
  constructor(public readonly judge: Judge) {}
}
