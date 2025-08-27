import { Module } from '@nestjs/common';
import { FareManagementController } from './fare-management.controller';
import { FareManagementService } from './fare-management.service';

@Module({
  controllers: [FareManagementController],
  providers: [FareManagementService]
})
export class FareManagementModule {}
