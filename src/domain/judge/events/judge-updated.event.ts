import { Metadata } from '@lib/metadata';
import { Judge, judgeDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchange/judges/judge.updated.user.{user}',
  schema: Type.Object(
    {
      judge: Type.Unsafe(Type.Ref(judgeDto)),
      previous_attributes: Type.Unsafe(Type.Ref(judgeDto)),
    },
    { additionalProperties: false, $id: 'judgeUpdatedEvent' },
  ),
})
export class JudgeUpdatedEvent extends Event {
  constructor(
    public readonly judge: Judge,
    public readonly previous_attributes: Partial<Judge>,
    metadata: Metadata,
  ) {
    super(metadata);
  }
}
