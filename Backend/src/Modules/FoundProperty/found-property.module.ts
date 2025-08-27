import { Module } from '@nestjs/common';
import { FoundPropertyService } from './found-property.service';
import { FoundPropertyController } from './found-property.controller';
import { PrismaService } from '../../Prisma/prisma.service';

@Module({
  controllers: [FoundPropertyController],
  providers: [FoundPropertyService, PrismaService],
})
export class FoundPropertyModule {}
