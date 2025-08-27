// Global/FeeManagement/fee.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FeeService } from './fee.service';

@Controller('fees')
export class FeeController {
  constructor(private feeService: FeeService) {}

  @Post('category')
  create(@Body() data: {
    name: string;
    description: string;
    bookingFee: number;
    feePerMile: number;
  }) {
    return this.feeService.createCategory(data);
  }

  @Get('category')
  getAll() {
    return this.feeService.getAllCategories();
  }

  @Get('category/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.feeService.getCategory(id);
  }

  @Patch('category/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: Partial<{
      name: string;
      description: string;
      bookingFee: number;
      feePerMile: number;
    }>,
  ) {
    return this.feeService.updateCategory(id, data);
  }

  @Delete('category/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.feeService.deleteCategory(id);
  }
}
