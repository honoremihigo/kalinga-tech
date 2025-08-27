import { Module } from '@nestjs/common';
import { LostPropertiesController } from './lostProperty.controller';
import { LostPropertiesService } from './lostProperty.service';
import { MailService } from 'src/Global/Messages/email/mail.service';

@Module({
  controllers: [LostPropertiesController],
  providers: [LostPropertiesService, MailService],
})
export class LostPropertiesModule {}
