import { Inject, Injectable } from '@nestjs/common';
import { ICommand, CommandBus as NestCommandBus } from '@nestjs/cqrs';
import { QUEUE_NAME, QUEUE_OPTIONS } from './constants';
import { Queue, QueueOptions } from 'bullmq';
import { randomUUID } from 'crypto';
import { BullmqConfig, bullmqConfig } from '@config/bullmq.config';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CommandBus extends NestCommandBus {
  constructor(
    @Inject(bullmqConfig.KEY)
    private readonly bc: BullmqConfig,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }
  public async execute<T extends ICommand, R = any>(command: T): Promise<R> {
    const queueName = Reflect.getMetadata(
      QUEUE_NAME,
      command.constructor,
    ) as string;
    if (queueName) {
      const queueOptions = Reflect.getMetadata(
        QUEUE_OPTIONS,
        command.constructor,
      ) as QueueOptions | undefined;
      const queue = new Queue(queueName, {
        ...queueOptions,
        connection: {
          port: this.bc.port,
          host: this.bc.host,
          db: this.bc.db,
        },
      });
      const job = await queue.add(randomUUID(), command);
      return job as R;
    }
    return super.execute(command);
  }
}
