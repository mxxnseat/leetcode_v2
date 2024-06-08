import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
}
