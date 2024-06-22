import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Client, IStompSocket } from '@stomp/stompjs';
import { STOMP_CLIENT } from './constants';
import { StompConfig, stompConfig } from '@config/stomp.config';
import { WebSocket } from 'ws';
import { EventMapperSaga } from './sagas';
import { PublishStompMessageHandler } from './commands/handlers';
import { StompConnectError } from './errors';

@Module({})
export class StompModule implements OnModuleDestroy {
  public static forRoot(): DynamicModule {
    return {
      module: StompModule,
      providers: [
        {
          provide: STOMP_CLIENT,
          inject: [stompConfig.KEY],
          useFactory: (sc: StompConfig) => {
            const client = new Client({
              connectHeaders: {
                login: sc.login,
                passcode: sc.passcode,
                host: sc.vhost,
              },
            });
            client.onStompError = async (frame) => {
              await client.deactivate();
              throw new StompConnectError(frame.headers['message'], frame.body);
            };
            client.webSocketFactory = () =>
              new WebSocket(sc.brokerUrl) as IStompSocket;
            client.activate();
            return client;
          },
        },
        PublishStompMessageHandler,
        EventMapperSaga,
      ],
    };
  }

  constructor(@Inject(STOMP_CLIENT) private readonly stompClient: Client) {}

  public async onModuleDestroy(): Promise<void> {
    await this.stompClient.deactivate();
  }
}
