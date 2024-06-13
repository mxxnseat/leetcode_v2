import { Metadata } from '@lib/metadata';
import { Problem, problemDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';
import { Expose } from 'class-transformer';

@StompQueue({
  destination: '/exchanges/problems/problem.updated',
  schema: Type.Object(
    {
      problem: Type.Unsafe(Type.Ref(problemDto)),
      previous_attributes: Type.Unsafe(Type.Ref(problemDto)),
    },
    { additionalProperties: false, $id: 'problemUpdatedEvent' },
  ),
})
export class ProblemUpdatedEvent extends Event {
  constructor(
    public readonly problem: Problem,
    public readonly previous_attributes: Partial<Problem>,
    metadata: Metadata,
  ) {
    super(metadata);
  }
}
