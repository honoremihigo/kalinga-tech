import { 
  Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete 
} from '@nestjs/common';
import { LostPropertyService } from './lost-property.service';

@Controller('lost-property')
export class LostPropertyController {
  constructor(private readonly lostPropertyService: LostPropertyService) {}

  @Post()
  async createReport(@Body() dto: any) {
    const report = await this.lostPropertyService.createLostPropertyReport(dto);
    return {
      message: 'Lost property report received successfully.',
      data: report,
    };
  }

  @Get()
  async getReports() {
    return this.lostPropertyService.getAllReports();
  }

  @Put(':id')
  async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    const updated = await this.lostPropertyService.updateLostProperty(id, dto);
    return {
      message: 'Lost property report updated successfully.',
      data: updated,
    };
  }

  @Delete(':id')
  async deleteReport(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.lostPropertyService.deleteLostProperty(id);
    return { message: 'Lost property report deleted successfully.' };
  }

  // Activate (mark as found and move to foundProperty model)
  @Post('activate/:id')
  async activateReport(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.lostPropertyService.activateLostProperty(id);
    return result;
  }

  // --- Found Properties endpoints ---

  @Get('found')
  async getFoundProperties() {
    return this.lostPropertyService.getAllFoundProperties();
  }

  @Put('found/:id')
  async updateFoundProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    const updated = await this.lostPropertyService.updateFoundProperty(id, dto);
    return {
      message: 'Found property updated successfully.',
      data: updated,
    };
  }

  @Delete('found/:id')
  async deleteFoundProperty(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.lostPropertyService.deleteFoundProperty(id);
    return { message: 'Found property deleted successfully.' };
  }
}
