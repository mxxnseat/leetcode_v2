import { Metadata } from '@lib/metadata';
import { Problem, problemDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchanges/problems/problem.created',
  schema: Type.Object(
    {
      problem: Type.Unsafe(Type.Ref(problemDto)),
    },
    { additionalProperties: false, $id: 'problemCreatedEvent' },
  ),
})
export class ProblemCreatedEvent extends Event {
  constructor(public readonly problem: Problem, metadata: Metadata) {
    super(metadata);
  }
}
