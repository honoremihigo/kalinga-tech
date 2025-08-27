import { Module } from '@nestjs/common';
import { RequestRideManagementController }  from './request-ride-management.controller'
import { RequestRideManagementService } from './request-ride-management.service'
import { PricingService } from 'src/Global/Pricing/pricing.service';
import { AddressProcessorService } from 'src/Global/RouteSense/address-processor.service';
import { RequestRideGateway } from './request-ride.gateway';

@Module({
  controllers: [RequestRideManagementController],
  providers: [RequestRideManagementService, PricingService, AddressProcessorService , RequestRideGateway]
})
export class RequestRideManagementModule {}
 