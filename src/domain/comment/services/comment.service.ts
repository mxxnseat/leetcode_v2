import { CRUDService } from '@lib/crud';
import { Comment } from '../schemas';
import { Injectable } from '@nestjs/common';
import {
  CommentCreatedEvent,
  CommentDeletedEvent,
  CommentUpdatedEvent,
} from '../events';
import { CommentRepository } from '../repositories';
import { EventBus } from '@lib/modules/cqrs/event-bus';

@Injectable()
export class CommentService extends CRUDService<Comment> {
  constructor(commentRepository: CommentRepository, eventBus: EventBus) {
    super(
      {
        events: {
          created: CommentCreatedEvent,
          deleted: CommentDeletedEvent,
          updated: CommentUpdatedEvent,
        },
      },
      commentRepository,
      eventBus,
    );
  }
}
