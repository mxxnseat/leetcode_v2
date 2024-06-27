import { Metadata } from '@lib/metadata';
import { Comment, commentDto } from '../schemas';
import { Event } from '@lib/modules/cqrs/event';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { Type } from '@sinclair/typebox';

@StompQueue({
  destination: '/exchange/comments/comment.updated',
  schema: Type.Object(
    {
      comment: Type.Unsafe(Type.Ref(commentDto)),
      previous_attributes: Type.Unsafe(Type.Ref(commentDto)),
    },
    { additionalProperties: false, $id: 'commentUpdatedEvent' },
  ),
})
export class CommentUpdatedEvent extends Event {
  constructor(
    public readonly comment: Comment,
    public readonly previous_attributes: Partial<Comment>,
    metadata: Metadata,
  ) {
    super(metadata);
  }
}
