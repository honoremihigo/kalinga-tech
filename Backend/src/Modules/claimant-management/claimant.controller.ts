import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClaimantService } from './claimant.service';

@Controller('claimants')
export class ClaimantController {
  constructor(private readonly service: ClaimantService) {}

  @Post('create')
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
