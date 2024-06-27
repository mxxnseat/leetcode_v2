import { Metadata } from '@lib/metadata';
import { Problem, problemDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchange/problems/problem.deleted',
  schema: Type.Object(
    {
      problem: problemDto,
    },
    { additionalProperties: false, $id: 'problemDeletedEvent' },
  ),
})
export class ProblemDeletedEvent extends Event {
  constructor(public readonly problem: Problem, metadata: Metadata) {
    super(metadata);
  }
}
