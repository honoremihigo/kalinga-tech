import { 
  Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete 
} from '@nestjs/common';
import { FoundPropertyService } from './found-property.service';

@Controller('found-property')
export class FoundPropertyController {
  constructor(private readonly foundPropertyService: FoundPropertyService) {}

  @Post()
  async createFoundProperty(@Body() dto: any) {
    const found = await this.foundPropertyService.createFoundProperty(dto);
    return {
      message: 'Found property created successfully.',
      data: found,
    };
  }

  @Get()
  async getFoundProperties() {
    return this.foundPropertyService.getAllFoundProperties();
  }

  @Get(':id')
  async getFoundPropertyById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.foundPropertyService.getFoundPropertyById(id);
  }

  @Put(':id')
  async updateFoundProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    const updated = await this.foundPropertyService.updateFoundProperty(id, dto);
    return {
      message: 'Found property updated successfully.',
      data: updated,
    };
  }

  @Delete(':id')
  async deleteFoundProperty(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.foundPropertyService.deleteFoundProperty(id);
    return { message: 'Found property deleted successfully.' };
  }

  @Post('activate/:id')
  async deliverFoundProperty(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const delivered = await this.foundPropertyService.deliverFoundProperty(id);
    return {
      message: 'Found property marked as delivered to client.',
      data: delivered,
    };
  }
}
