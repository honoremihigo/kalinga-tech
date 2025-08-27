import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { FareManagementService } from './fare-management.service';

@Controller('fare')
export class FareManagementController {
    constructor(private readonly fareService: FareManagementService) {}

  @Post('create')
  async create(@Body() data: any) {
    try {
      const fare = await this.fareService.create(data);
      return {
        message: 'Fare created successfully',
        fare,
      };
    } catch (error) {
      console.error('Error creating fare', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  async findAll() {
    try {
      const fares = await this.fareService.findAll();
      return fares;
    } catch (error) {
      console.error('Error fetching fares', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('getone/:id')
  async findOne(@Param('id') id: number) {
    try {
      const fare = await this.fareService.findOne(id);
      if (!fare) {
        throw new NotFoundException('Fare not found');
      }
      return fare;
    } catch (error) {
      console.error('Error fetching fare by id', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() data: any) {
    try {
      const updatedFare = await this.fareService.update(id, data);
      return {
        message: 'Fare updated successfully',
        updatedFare,
      };
    } catch (error) {
      console.error('Error updating fare', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    try {
      await this.fareService.delete(id);
      return {
        message: 'Fare deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting fare', error);
      throw new BadRequestException(error.message);
    }
  }
}
