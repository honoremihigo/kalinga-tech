import { Module } from '@nestjs/common';
import { FoundPropertiesService } from './foundProperty.service';
import { FoundPropertiesController } from './foundProperty.controller';
import { MailService } from 'src/Global/Messages/email/mail.service';

@Module({
  controllers: [FoundPropertiesController],
  providers: [FoundPropertiesService, MailService],
})
export class FoundPropertiesModule {}
