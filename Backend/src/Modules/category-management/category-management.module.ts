import { Module } from '@nestjs/common';
import { CategoryManagementController } from './category-management.controller';
import { CategoryManagementService } from './category-management.service';

@Module({
  controllers: [CategoryManagementController],
  providers: [CategoryManagementService]
})
export class CategoryManagementModule {}
