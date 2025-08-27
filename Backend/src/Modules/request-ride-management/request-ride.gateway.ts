import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RequestRideManagementService } from './request-ride-management.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // adjust for security
  Credential: true,
  // namespace: '/request-ride', // added namespace
})
export class RequestRideGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private driverSockets = new Map<string, Socket>();
  private clientSockets = new Map<string, Socket>();
  private rejectedDrivers = new Set<string>();

  constructor(
    private readonly requestrideServices: RequestRideManagementService,
  ) {}

  handleConnection(socket: Socket) {
    const { role, driverId, clientId } = socket.handshake.query;

    if (role == 'driver' && driverId) {
      this.driverSockets.set(driverId as string, socket);
    } else if (role == 'client' && clientId) {
      this.clientSockets.set(clientId as string, socket);
    }
    console.log('connected drivers:', this.driverSockets.size);
    console.log('connected clients:', this.clientSockets.size);
    console.log(`connected sockets:${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    for (const [driverId, s] of this.driverSockets.entries()) {
      if (s.id === socket.id) {
        this.driverSockets.delete(driverId);
        console.log(`Driver ${driverId} disconnected.`);
        break;
      }
    }
    for (const [clientId, s] of this.clientSockets.entries()) {
      if (s.id === socket.id) {
        this.clientSockets.delete(clientId);
        console.log(`client ${clientId} disconnected.`);
        break;
      }
    }
    console.log(`disconnected sockets:${socket.id}`);
  }

  @SubscribeMessage('client-chose')
  async handleClientAccepted(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      console.log('Client chose drive:', data);
      const recievedData = JSON.parse(data);
      console.log(data);
      const response =
        await this.requestrideServices.clientChoseDriver(recievedData);
      const { driverId } = recievedData;
      const driverSocket = this.driverSockets.get(String(driverId));

      if (driverSocket) {
        console.log('Driver socket found:', driverSocket.id);
        driverSocket.emit('ride-requested', {
          response: response,
        });
      } else {
        socket.emit('error', {
          message: ' driver not connected to socket ',
        });
      }
   return{
        status: 'success',
        data: response,
        message: 'Driver notified successfully',
      };
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }

  @SubscribeMessage('driver-accepted')
  async handleDriverAccepted(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      console.log('driver accepted:', data);
      const recievedData = JSON.parse(data);
      const { driverId, clientId } = recievedData;
      const response = await this.requestrideServices.AcceptedDriver(driverId);
      console.log('response:', response);
      const clientsocket = this.clientSockets.get(String(clientId));
      if (clientsocket) {
        clientsocket.emit('drivers-data', {
          response: response,
        });
      } else {
        socket.emit('error', {
          message: ' client not connected to socket ',
        });
      }
         return{
        status: 'success',
        data: response,
        message: 'clent notified successfully',
      };
    
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }

  @SubscribeMessage('driver-rejected')
  async driverRejected(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const parsedData = JSON.parse(data)
      const { pickuplat, pickuplong , clientId , clientname, clientEmail , clientPhone , price , pickupaddress, duration , driverId,   } = parsedData
      this.rejectedDrivers.add(driverId)
      const driver = await this.requestrideServices.findAnotherDriver(pickuplat, pickuplong, this.rejectedDrivers)
      const driverSocket = this.driverSockets.get(String(driver.id))
      if (driverSocket) {
        driverSocket.emit('client-sent-request',{
          reponse: {
            clientId: clientId,
            clientname: clientname,
            clientEmail:clientEmail,
            clientPhone: clientPhone,
            price: price,
            pickupaddress:pickupaddress,
            duration: duration,
            driverId: driver.id,
            pickuplat:pickuplat,
            pickuplong: pickuplong
          }
        })
      }
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }

  @SubscribeMessage('client-rejected')
  async handleClientRejection(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const parsedData = JSON.parse(data);
      const { driverId, clientId } = parsedData;
      const driverSocket = this.driverSockets.get(String(driverId));
      if (driverSocket) {
        driverSocket.emit('rejection', {
          message: 'client rejected your request',
        });
      } else {
        socket.emit('error', {
          message: 'driver not online',
        });
      }
      socket.emit('driver-ack', {
        message: 'driver recieved rejection',
      });
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }

  @SubscribeMessage('client-accepted')
  async rideConfirmed(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const parsedData = JSON.parse(data);
      const response = await this.requestrideServices.rideConfirmed(parsedData);
      const { driverId } = parsedData;
      const driverSocket = this.driverSockets.get(String(driverId));
      if (driverSocket) {
        driverSocket.emit('ride-accepted', {
          message: 'client accepted the request',
        });
      } else {
        socket.emit('error', {
          message: 'driver not online',
        });
      }

      socket.emit('ride-payment', {
        response: response,
      });
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }

  @SubscribeMessage('payment-confirmed')
  async paymentConfirmed(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const parsedData = JSON.parse(data);
      const response =
        await this.requestrideServices.paymentConfirmed(parsedData);
      const { driverId } = parsedData;
      const driverSocket = this.driverSockets.get(String(driverId));
      if (driverSocket) {
        driverSocket.emit('payment-done', {
          message: 'client payment was success',
        });
      } else {
        socket.emit('error', {
          message: 'driver not online',
        });
      }
      socket.emit('payment-success', {
        response: response,
      });
    } catch (error) {
      console.error('Gateway error:', error);
      socket.emit('error', {
        message: error.message || 'An error occurred',
      });
    }
  }
}
