import { Injectable } from '@nestjs/common';
import { IEvent, EventPublisher as NestEventPublisher } from '@nestjs/cqrs';
import { EventBus } from './event-bus';
import { Event } from './event';

@Injectable()
export class EventPublisher<
  T extends Event = Event,
> extends NestEventPublisher<T> {
  constructor(eventBus: EventBus<T>) {
    super(eventBus);
  }
}
