import { AMQPWebSocketClient } from '@cloudamqp/amqp-client';
import { app } from '../../global-hooks';
import { StompQueue } from '@lib/modules/stomp/decorators';
import { PublishStompMessageHandler } from '@lib/modules/stomp/commands/handlers';
import { Type } from '@sinclair/typebox';
import { PublishStompMessageCommand } from '@lib/modules/stomp/commands/impl';
import { Event } from '@lib/modules/cqrs/event';
import { WebSocket } from 'ws';
import { getRandomMetadata } from 'tests/integration/core';
import { Metadata } from '@lib/metadata';
import { expect } from 'chai';

@StompQueue({
  destination: '/exchange/tests/route.key',
  schema: Type.Object({}),
})
class TestEvent extends Event {}

@StompQueue({
  destination: '/exchange/tests/users.{user}',
  schema: Type.Object({}),
})
class TestRoutingEvent extends Event {
  constructor(
    public readonly data: Record<string, unknown>,
    metadata: Metadata,
  ) {
    super(metadata);
  }
}

describe('STOMP', () => {
  let publishStompMessageHandler: PublishStompMessageHandler;

  before(async () => {
    publishStompMessageHandler = app.get(PublishStompMessageHandler);
    global.WebSocket = WebSocket;
  });

  it('client should retrieve data from destination', async function () {
    const testEvent = new TestEvent(getRandomMetadata());
    const amqpClient = new AMQPWebSocketClient(
      'ws://localhost:15670',
      '/',
      'guest',
      'guest',
    );
    const amqpConnection = await amqpClient.connect();
    const channel = await amqpConnection.channel();
    const queue = await channel.queue('', { exclusive: true });
    await queue.bind('tests', 'route.key');
    const consumer = await queue.subscribe({ noAck: false }, () =>
      consumer.cancel(),
    );
    await publishStompMessageHandler.execute(
      new PublishStompMessageCommand(testEvent, testEvent.metadata),
    );
    await consumer.wait();
  });

  it('client should retrieve data from destination using route key', async () => {
    const subscribedTestRoutingEvent = new TestRoutingEvent(
      { hello: 'world' },
      getRandomMetadata(),
    );
    const unsubscribedTestRoutingEvent = new TestRoutingEvent(
      { hello: 'invisible' },
      getRandomMetadata(),
    );

    const amqpClient = new AMQPWebSocketClient(
      'ws://localhost:15670',
      '/',
      'guest',
      'guest',
    );
    const amqpConnection = await amqpClient.connect();
    const channel = await amqpConnection.channel();
    const queue = await channel.queue('', { exclusive: true });
    await queue.bind(
      'tests',
      `users.${subscribedTestRoutingEvent.metadata.user}`,
    );
    const consumer = await queue.subscribe({ noAck: false }, async (msg) => {
      const message = JSON.parse(msg.bodyToString() as string);
      expect(message.data).property('hello').eq('world');
      await consumer.cancel();
    });
    await Promise.all([
      publishStompMessageHandler.execute(
        new PublishStompMessageCommand(
          subscribedTestRoutingEvent,
          subscribedTestRoutingEvent.metadata,
        ),
      ),
      publishStompMessageHandler.execute(
        new PublishStompMessageCommand(
          unsubscribedTestRoutingEvent,
          unsubscribedTestRoutingEvent.metadata,
        ),
      ),
    ]);
    await consumer.wait();
  });

  after(() => {
    global.WebSocket = undefined;
  });
});
