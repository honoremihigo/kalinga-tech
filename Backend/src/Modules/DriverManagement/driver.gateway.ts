import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // adjust for security
})
export class DriverGateway {
  @WebSocketServer()
  server: Server;

  broadcastDriverStatusUpdate(data: any) { 
    this.server.emit('driverStatusUpdate', data);
  }
}
