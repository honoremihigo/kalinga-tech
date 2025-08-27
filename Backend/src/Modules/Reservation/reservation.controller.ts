// modules/reservation/reservation.controller.ts
import { Controller, Post, Body, Get,Patch, Param, BadRequestException } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() body: any) {
    return this.reservationService.handleReservation(body);
  }

    @Get()
  async FetchReservation(@Body() body: any) {
    return this.reservationService.getAllReservations();
  }
  @Get(':id')
async fetchReservationById(@Param('id') id: string) {
  return this.reservationService.getReservationById(id);
}


@Patch('confirm/:reservationId')
async confirmReservation(
  @Param('reservationId') reservationId: string,
  @Body() body: { driverId: string },
) {
  return this.reservationService.confirmReservation(
    reservationId,
    body.driverId,
  );
}

@Patch('cancel/:id')
  async cancelReservation(
    @Param('id') reservationId: string,
    @Body() body: { reason?: string },
  ) {
    return this.reservationService.cancelReservation(reservationId, body.reason);
  }

  @Post('rating/:id')
async rateDriver(
  @Param('id') reservationId: string,
  @Body() body: { rating: number },
) {
  return this.reservationService.rateDriver(reservationId, body.rating);
}

@Post('lost-items/:reservationId')
async declareLostItem(
  @Param('reservationId') reservationId: string,
  @Body() body: any,
) {
  console.log('Received declareLostItem request:', { reservationId, ...body });

  // Map incoming body keys to expected keys
  const lostItemData = {
    itemCategory: body.itemCategory,
    itemDescription: body.description,         // map description to itemDescription
    approximateValue: body.approximateValue,
    lostLocation: body.lostLocation,
    preferredContact: body.preferredContactMethod,  // map preferredContactMethod to preferredContact
    bestContactTime: body.bestContactTime,
    additionalNotes: body.additionalNotes,
  };

  if (
    !lostItemData.itemCategory ||
    !lostItemData.itemDescription ||
    !lostItemData.preferredContact
  ) {
    throw new BadRequestException('Missing required lost item fields.');
  }

  return await this.reservationService.declareLostItemByReservationId(
    reservationId,
    lostItemData,
  );
}

  @Post('found-items')
  async create(@Body() body: {
    reservationId?: string;
    itemCategory: string;
    itemDescription: string;
    foundLocation?: string;
    additionalNotes?: string;
  }) {
    if (!body.itemCategory || !body.itemDescription) {
      throw new BadRequestException('Item category and description are required');
    }

    return this.reservationService.createFoundItem({
      reservationId: body.reservationId,
      itemCategory: body.itemCategory,
      itemDescription: body.itemDescription,
      foundLocation: body.foundLocation,
      additionalNotes: body.additionalNotes,
    });
  }





@Get('check-new')
  async checkNewReservations() {
    const newReservations = await this.reservationService.getNewReservations();
    return {
      hasNewReservation: newReservations.length > 0,
      newReservations,
    };
  }


}
