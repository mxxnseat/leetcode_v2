import Ajv from 'ajv';
import { CommandHandler } from '@lib/modules/cqrs/decorators';
import { PublishStompMessageCommand } from '../impl';
import { WorkerHost } from '@lib/modules/cqrs/command-handler';
import { Client } from '@stomp/stompjs';
import { STOMP_CLIENT, STOMP_QUEUE_OPTIONS } from '../../constants';
import { Inject } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { StompQueueOptions } from '../../interfaces';

@CommandHandler(PublishStompMessageCommand)
export class PublishStompMessageHandler extends WorkerHost<PublishStompMessageCommand> {
  private readonly ajv = new Ajv({ removeAdditional: true });

  constructor(
    @Inject(STOMP_CLIENT)
    private readonly stompClient: Client,
  ) {
    super();
  }

  public async execute({ event }: PublishStompMessageCommand): Promise<void> {
    const { destination, schema } = Reflect.getMetadata(
      STOMP_QUEUE_OPTIONS,
      event,
    ) as StompQueueOptions;
    const plainObject = instanceToPlain(event);
    this.ajv.compile(schema)(plainObject);
    this.stompClient.publish({
      destination,
      body: JSON.stringify(plainObject),
    });
  }
}
