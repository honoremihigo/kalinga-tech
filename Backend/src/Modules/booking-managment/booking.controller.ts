import { Controller, Get, Post, Body, Param, Delete, Patch, BadRequestException, HttpException } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('dispatch')
  create(@Body() body: any) {
    return this.bookingService.createBooking(body);
  }
  @Post('client')
  clientBooking(@Body() body: any) {
    return this.bookingService.clientBooking(body);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findUsingBookingnumber(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.bookingService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  // Approve booking
  @Post(':bookingId/approve')
  async approveBooking(
    @Param('bookingId') bookingId: string,
    @Body()
    body: {
      driverId: number;
      extraCharge?: number;
      parkingFee?: number;
      waitingFee?: number;
    },
  ) {
    if (!body.driverId) {
      throw new BadRequestException('Driver ID is required');
    }

    return this.bookingService.approveBooking(bookingId, body);
  }

  // Reject booking
  @Post(':bookingId/reject')
  async rejectBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.rejectBooking(bookingId);
  }

  @Post(':sessionId')
  async markBookingAsPaid(@Param('sessionId') sessionId: string ){
    try {
      return await this.bookingService.markAsPaidBooking(sessionId)
    } catch (error) {
      throw new HttpException(error.message,error.status)
    }
  }
}
