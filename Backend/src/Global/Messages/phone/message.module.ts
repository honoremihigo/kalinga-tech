import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from '../../../Prisma/prisma.service';

@Module({
  providers: [MessageService, PrismaService],
  controllers: [MessageController],
})
export class MessageModule {}
