import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Console } from 'console';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
//! instead of creating a new room for each ticket , I Created a map to sotore ticket ID maps to a set of connections
// to reduce the number of rooms .
export class Gateway {
  private logger = new Logger(Gateway.name);
  private ticketSocketMap: Map<string, Socket> = new Map();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.logger.log(`Client connected with ${socket.id} id `);
    });
  }

  // When a user logs in or connects, store their socket ID
  @SubscribeMessage('user-connected')
  handleUserConnected(socket: Socket, payload: { userId: string }) {
    console.log(`User connected`, socket.id);
    this.ticketSocketMap.set(payload.userId, socket);
    // socket.join(payload.userId);
  }

  // When a user logs out or disconnects, remove their socket ID
  @SubscribeMessage('user-disconnected')
  handleUserDisconnected(payload: { userId: string }) {
    this.ticketSocketMap.delete(payload.userId);
  }

  handleMessage(userId: string) {
    console.log(userId);
    const socket = this.ticketSocketMap.get(userId);
    console.log(socket);

    if (socket) {
      this.server.to(socket.id).emit('got-updates', 'data');
    }
    // console.log(this.ticketSocketMap);
    // console.log(socket);
    //   socket.emit('got-updates', {
    //     message: 'message',
    //     time: new Date().toDateString(),
    //   });
  }
}
