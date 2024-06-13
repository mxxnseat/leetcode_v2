import { StompQueue } from '@lib/modules/stomp/decorators';
import { Judge, judgeDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { Metadata } from '@lib/metadata';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchange/judges/judge.created.user.{user}',
  schema: Type.Object(
    { judge: judgeDto },
    { additionalProperties: false, $id: 'judgeCreatedEvent' },
  ),
})
export class JudgeCreatedEvent extends Event {
  constructor(public readonly judge: Judge, metadata: Metadata) {
    super(metadata);
  }
}
