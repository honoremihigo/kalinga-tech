import { Module } from '@nestjs/common';
import { ClaimantService } from './claimant.service';
import { ClaimantController } from './claimant.controller';

@Module({
  controllers: [ClaimantController],
  providers: [ClaimantService],
})
export class ClaimantModule {}
