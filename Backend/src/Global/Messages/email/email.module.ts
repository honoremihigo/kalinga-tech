import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { GmailService } from './emailmessage.service';
import { GmailController } from './email.controller';
import { gmail } from 'googleapis/build/src/apis/gmail';

@Module({
  providers: [EmailService,GmailService],
  controllers:[GmailController],
  exports: [EmailService],
})
export class EmailModule {}
