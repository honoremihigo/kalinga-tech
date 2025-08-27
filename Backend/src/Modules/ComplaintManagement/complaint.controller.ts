import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ComplaintService } from './complaint.service';

@Controller('complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  async create(@Body() data: any) {
    return this.complaintService.create(data);
  }

  @Get()
  async findAll() {
    return this.complaintService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.complaintService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.complaintService.delete(id);
  }
}
