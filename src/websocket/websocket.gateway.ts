import { OnModuleInit } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Observable, map } from 'rxjs';
import { JudgeEvent } from 'src/judge';
import { Server } from 'ws';

@WebSocketGateway()
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  public onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket);
    });
  }

  @Saga()
  public broadcastIncomingEvent($event: Observable<any>): any {
    return $event.pipe(
      ofType(JudgeEvent),
      map(({ result }) => {
        this.server.clients.forEach((client) => client.send(result));
      }),
    );
  }
}
