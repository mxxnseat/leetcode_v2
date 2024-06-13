import { Injectable } from '@nestjs/common';
import { Saga } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import { STOMP_QUEUE } from '../constants';
import { PublishStompMessageCommand } from '../commands/impl';
import { ICommand } from '@lib/modules/cqrs/command';
import { Event } from '@lib/modules/cqrs/event';

@Injectable()
export class EventMapperSaga {
  @Saga()
  public incomingEvent($events: Observable<Event>): Observable<ICommand> {
    return $events.pipe(
      filter((event) => Reflect.hasOwnMetadata(STOMP_QUEUE, event)),
      map((event) => new PublishStompMessageCommand(event, event.metadata)),
    );
  }
}
