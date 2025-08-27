import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FoundPropertiesService } from './foundProperty.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('found-properties')
export class FoundPropertiesController {
  constructor(private readonly service: FoundPropertiesService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/found-properties',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = `/uploads/found-properties/${file.filename}`;
    return this.service.create({
      ...data,
      imageUrl,
    });
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('/return')
  async approvedFoundProperty(@Body() data) {
    return this.service.approveFoundProperty(data);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/found-properties',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(@Param('id') id: string, @Body() data: any, @UploadedFile() file?: Express.Multer.File ) {
    if (file) {
      data.imageUrl = `uploads/found-properties/${file.filename}`; // or full path if needed
    }
    return this.service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
