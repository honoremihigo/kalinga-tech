import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Module({
  providers: [PricingService],
  exports: [PricingService], // export it so other modules can use it
})
export class PricingModule {}
