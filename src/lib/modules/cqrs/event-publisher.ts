import { Injectable } from '@nestjs/common';
import { IEvent, EventPublisher as NestEventPublisher } from '@nestjs/cqrs';
import { EventBus } from './event-bus';

@Injectable()
export class EventPublisher<
  T extends IEvent = IEvent,
> extends NestEventPublisher<T> {
  constructor(eventBus: EventBus<T>) {
    super(eventBus);
  }
}
