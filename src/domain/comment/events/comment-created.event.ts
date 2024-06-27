import { Metadata } from '@lib/metadata';
import { Comment, commentDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchange/comments/comment.created',
  schema: Type.Object(
    {
      comment: Type.Unsafe(Type.Ref(commentDto)),
    },
    { additionalProperties: false, $id: 'commentCreatedEvent' },
  ),
})
export class CommentCreatedEvent extends Event {
  constructor(public readonly comment: Comment, metadata: Metadata) {
    super(metadata);
  }
}
