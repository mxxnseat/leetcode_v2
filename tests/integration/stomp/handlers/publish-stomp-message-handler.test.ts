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
import { StompConfig, stompConfig } from '@config/stomp.config';
import { Client, IStompSocket } from '@stomp/stompjs';

// THE STUPIDEST SUITES

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
  let client: Client;
  before(async () => {
    publishStompMessageHandler = app.get(PublishStompMessageHandler);
    const sc = app.get(stompConfig.KEY) as StompConfig;
    client = new Client({
      brokerURL: 'ws://127.0.0.1:15674/ws',
      connectHeaders: {
        host: sc.vhost,
        login: sc.login,
        passcode: sc.passcode,
      },
    });
    client.webSocketFactory = () =>
      new WebSocket('ws://127.0.0.1:15674/ws') as IStompSocket;
  });

  beforeEach(() => {
    client.activate();
  });

  afterEach(() => {
    client.deactivate();
  });

  it('client should retrieve data from destination', async function () {
    const testEvent = new TestEvent(getRandomMetadata());
    // STUPID
    let resolve;
    client.onConnect = () => {
      client.subscribe('/exchange/tests/route.key', () => {
        resolve();
      });
    };
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await publishStompMessageHandler.execute(
      new PublishStompMessageCommand(testEvent, testEvent.metadata),
    );
    await new Promise((res) => {
      resolve = res;
    });
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
    let resolve;
    client.onConnect = () => {
      client.subscribe(
        `/exchange/tests/users.${subscribedTestRoutingEvent.metadata.user}`,
        (msg) => {
          expect(JSON.parse(msg.body).data).property('hello').eq('world');
          resolve();
        },
      );
    };

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
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
    await new Promise((res) => {
      resolve = res;
    });
  });
});
