import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway {
  private logger = new Logger(Gateway.name);
  private ticketSocketMap: Map<number, Socket> = new Map();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.logger.log(`Client connected with ${socket.id} id `);
    });
  }

  @SubscribeMessage('user-connected')
  handleUserConnected(socket: Socket, payload: { userId: number }) {
    this.ticketSocketMap.set(payload.userId, socket);
  }

  @SubscribeMessage('user-disconnected')
  handleUserDisconnected(payload: { userId: number }) {
    this.ticketSocketMap.delete(payload.userId);
  }

  notifyUser(userId: number, message: string) {
    const socket = this.ticketSocketMap.get(userId);
    if (socket) {
      this.server.to(socket.id).emit('got-updates', message);
    }
  }
}
