import { ICommand } from '@nestjs/cqrs';
import {
  COMMAND_METADATA,
  COMMAND_HANDLER_METADATA,
} from '@nestjs/cqrs/dist/decorators/constants';
import { randomUUID } from 'crypto';
import { QUEUE_NAME } from '../constants';
import { Processor } from '@nestjs/bullmq';

export const CommandHandler = (command: ICommand) => {
  return (target: Function) => {
    const queueName = Reflect.getMetadata(QUEUE_NAME, command);
    if (queueName) {
      Processor(queueName)(target);
    }

    if (!Reflect.hasOwnMetadata(COMMAND_METADATA, command)) {
      Reflect.defineMetadata(COMMAND_METADATA, { id: randomUUID() }, command);
    }
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
};
