// src/Global/Address_Processor/address-processor.module.ts
import { Module } from '@nestjs/common';
import { AddressProcessorService } from './address-processor.service';

@Module({
  providers: [AddressProcessorService],
  exports: [AddressProcessorService],  // Export to use in other modules
})
export class AddressProcessorModule {}
