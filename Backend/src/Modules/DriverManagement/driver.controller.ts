import { Controller,Get,Post,  Body,Param,Delete,Put,UploadedFiles,UseInterceptors} from '@nestjs/common';
import { basename } from 'path';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DriverService } from './driver.service';
import { multerStorage } from '../../common/Utils/file-upload.util';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

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
  console.log('🚀 Incoming driver POST request');
  // console.log('Uploaded Files:', files?.length);
  console.log('Body:', body);

  if (files && files.length > 0) {
    files.forEach((file) => {
      body[file.fieldname] = basename(file.path);
    });
  }

  return this.driverService.create(body);
}

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
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
    // ✅ Assign only filename to each field in data
    if (files && files.length > 0) {
      files.forEach((file) => {
        data[file.fieldname] = basename(file.path);
      });
    }

    console.log('Updating driver data:', data);
    return this.driverService.update(+id, data);
  }

 @Put('approve/:id')
  async approveDriver(@Param('id') id: string) {
    return this.driverService.updateStatus(+id, 'approved');
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }


}