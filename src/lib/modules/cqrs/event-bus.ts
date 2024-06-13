import { Injectable } from '@nestjs/common';
import {
  ICommand,
  IEvent,
  EventBus as NestEventBus,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { CommandBus } from './command-bus';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class EventBus<T extends IEvent = IEvent> extends NestEventBus<T> {
  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    unhandledExceptionBus: UnhandledExceptionBus,
  ) {
    super(commandBus, moduleRef, unhandledExceptionBus);
  }
}
