import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  productFileFields,
  productUploadConfig,
} from 'src/common/Utils/upload.utils';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor(productFileFields, productUploadConfig))
  async create(
    @Body() body: any,
    @UploadedFiles()
    files: {
      productImage?: Express.Multer.File[];
    },
  ) {
    try {
      const productImage = files.productImage
        ? `/uploads/product_photos/${files.productImage[0].filename}`
        : null;

      return await this.productService.create({
        ...body,
        productImage,
      });
    } catch (error) {
      console.error('Controller Error (create):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create product',
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.productService.findAll();
    } catch (error) {
      console.error('Controller Error (findAll):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch products',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      console.error('Controller Error (findOne):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch product',
      );
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(productFileFields, productUploadConfig))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files: {
      productImage?: Express.Multer.File[];
    },
  ) {
    try {
      if (files.productImage) {
        body.productImage = `uploads/product_photos/${files.productImage[0].filename}`;
      }
      return await this.productService.update(id, body);
    } catch (error) {
      console.error('Controller Error (update):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to update product',
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.productService.remove(id);
    } catch (error) {
      console.error('Controller Error (remove):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to delete product',
      );
    }
  }
}
