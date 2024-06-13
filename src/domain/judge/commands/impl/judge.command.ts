import { JUDGING_QUEUE_NAME } from '@domain/judge/constants';
import { Judge } from '@domain/judge/schemas';
import { Metadata } from '@lib/metadata';
import { Command } from '@lib/modules/cqrs/command';
import { Queue } from '@lib/modules/cqrs/decorators';

@Queue(JUDGING_QUEUE_NAME)
export class JudgeCommand extends Command {
  constructor(public readonly judge: Judge, metadata: Metadata) {
    super(metadata);
  }
}
