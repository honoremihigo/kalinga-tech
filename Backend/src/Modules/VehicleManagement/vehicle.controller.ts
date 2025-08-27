import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
  Patch, // <-- add this import
} from '@nestjs/common';
import { basename } from 'path';
import { Express } from 'express';
import { VehicleService } from './Vehicle.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { multerStorage } from '../../common/Utils/file-upload.util';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}


   @Patch('category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { category: string },
  ) {
    console.log('Updating category for vehicle:', id, 'to', body.category);
    return this.vehicleService.updateCategory(id, body.category);
  }

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multerStorage,
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        body[file.fieldname] = basename(file.path);
      });
    }

    console.log('Saving vehicle data:', body);
    return this.vehicleService.create(body);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multerStorage,
    }),
  )



  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: any,
  ) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        data[file.fieldname] = basename(file.path);
      });
    }

    console.log('Updating vehicle data:', data);
    return this.vehicleService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
