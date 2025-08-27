import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { RequestRideManagementService } from './request-ride-management.service';

@Controller('request')
export class RequestRideManagementController {
    constructor( private readonly requestRideServices: RequestRideManagementService){}

    @Post('get-nearby-drivers')
    async getNearbyDrivers(@Body() datas){
        try {
            return await this.requestRideServices.filterDriversByLocation(datas); 
        } catch (error) {
            console.error('Error getting nearby drivers:', error);
            throw new InternalServerErrorException(error.message);
        }
    }
}
