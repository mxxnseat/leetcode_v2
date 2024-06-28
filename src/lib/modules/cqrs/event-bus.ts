import { Injectable, Logger } from '@nestjs/common';
import { EventBus as NestEventBus, UnhandledExceptionBus } from '@nestjs/cqrs';
import { Event } from './event';
import { CommandBus } from './command-bus';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class EventBus<T extends Event = Event> extends NestEventBus<T> {
  private readonly logger = new Logger(EventBus.name);
  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    unhandledExceptionBus: UnhandledExceptionBus,
  ) {
    super(commandBus, moduleRef, unhandledExceptionBus);
  }

  publish<TEvent extends T, TContext = unknown>(
    event: TEvent,
    context?: TContext,
  ) {
    this.logger.log(
      {
        traceId: event.metadata.traceId,
        event: {
          name: event.constructor.name,
        },
      },
      `Outgoing event`,
    );
    super.publish(event, context);
  }
}
