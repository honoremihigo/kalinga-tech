import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import { DriverReservationService } from './driver-reservation.service';
import { JwTAuthGuard } from '../Auth/auth.guard'; // Adjust path if needed

@Controller('driver-reservations')
@UseGuards(JwTAuthGuard)
export class DriverReservationController {
  constructor(
    private readonly driverReservationService: DriverReservationService,
  ) {}

  // Get all reservations for the logged-in driver
  @Get()
  async getMyReservations(@Req() req) {
    const driverId = req.user.id;
    return this.driverReservationService.getReservationsByDriverId(driverId);
  }

  // Get reservation statistics for the logged-in driver
  @Get('stats')
  async getDriverStats(@Req() req) {
    const driverId = req.user.id;
    return this.driverReservationService.getDriverStats(driverId);
  }

  // Get wallet/earnings summary for the logged-in driver
  @Get('wallet')
  async getDriverWallet(@Req() req) {
    const driverId = req.user.id;
    return this.driverReservationService.getDriverEarningsSummary(driverId);
  }

  // Get a specific reservation by ID
  @Get(':id')
  async getReservationById(@Param('id') id: string) {
    return this.driverReservationService.getReservationById(id);
  }

  // Mark a reservation as complete
  @Put(':id/complete')
  async markComplete(@Param('id') id: string, @Req() req) {
    return this.driverReservationService.markCompleteByDriver(id);
  }
}
