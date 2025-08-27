import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryManagementService } from './category-management.service';

@Controller('category')
export class CategoryManagementController {
  constructor(private readonly categoryService: CategoryManagementService) {}

  @Post('create')
  async create(@Body() data) {
    try {
      return await this.categoryService.create(data);
    } catch (error) {
      console.log('error:', error);
      throw new Error(error.message);
    }
  }

  @Get('all')
  async findAll() {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      console.log('error:', error);
      throw new Error(error.message);
    }
  }

  @Get('getone/:id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      console.log('error:', error);
      throw new Error(error.message);
    }
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() data) {
    try {
      return await this.categoryService.update(id, data);
    } catch (error) {
      console.log('error:', error);
      throw new Error(error.message);
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      console.log('error:', error);
      throw new Error(error.message);
    }
  }
}
