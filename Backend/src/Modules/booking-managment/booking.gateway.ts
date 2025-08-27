import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { BookingService } from './booking.service';

@WebSocketGateway({
  cors: { origin: '*' },
  Credential: true,
})
export class BookingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor( private readonly bookingService:BookingService ) {}
  handleConnection(socket: Socket) {
    console.log('connected sockets:', socket.id);
  }
  handleDisconnect(socket: Socket) {
    console.log('disconnected sockets', socket.id);
  }

  async broadcastBookings() {
    const bookings = await this.bookingService.findAll();
    this.server.emit('bookingsData', bookings);
  }
}
