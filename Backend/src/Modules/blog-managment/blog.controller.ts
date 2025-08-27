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
import { BlogService } from './blog.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  blogFileFields,
  blogUploadConfig,
} from 'src/common/Utils/upload.utils';
import { RequestWithAdmin } from 'src/common/interfaces/request-admin.interface';
import { AdminAuthGuard } from 'src/Guards/AdminAuth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileFieldsInterceptor(blogFileFields, blogUploadConfig))
  async create(
    @Body() body: any,
    @UploadedFiles()
    files: {
      blogImage?: Express.Multer.File[];
    },
    @Req() req: RequestWithAdmin,
  ) {
    try {
      const adminId = req.admin?.id as string;
      const blogImage = files.blogImage
        ? `uploads/blog_photos/${files.blogImage[0].filename}`
        : null;
      return await this.blogService.create({
        ...body,
        blogImage,
        adminId,
      });
    } catch (error) {
      console.error('Controller Error (create):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create blog',
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.blogService.findAll();
    } catch (error) {
      console.error('Controller Error (findAll):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch blogs',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.blogService.findOne(id);
    } catch (error) {
      console.error('Controller Error (findOne):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch blog',
      );
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(blogFileFields, blogUploadConfig))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files: {
      blogImage?: Express.Multer.File[];
    },
  ) {
    try {
      if (files.blogImage) {
        body.blogImage = `uploads/blog_photos/${files.blogImage[0].filename}`;
      }
      return await this.blogService.update(id, body);
    } catch (error) {
      console.error('Controller Error (update):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to update blog',
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.blogService.remove(id);
    } catch (error) {
      console.error('Controller Error (remove):', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to delete blog',
      );
    }
  }
}
