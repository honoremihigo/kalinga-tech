import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { LostPropertiesService } from './lostProperty.service';

@Controller('lost-properties')
export class LostPropertiesController {
  constructor(private service: LostPropertiesService) {}

  @Post('create')
  create(@Body() data) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }


  // lost-property.controller.ts

@Put(':id/found')
async markAsFound(
  @Param('id') id: string,
  @Body() data: {
    returnerName: string;
    returnerPhone: string;
    returnerEmail: string;
    returnerDescription: string;
  }
) {
  return this.service.markAsFound(id, data);
}

}
