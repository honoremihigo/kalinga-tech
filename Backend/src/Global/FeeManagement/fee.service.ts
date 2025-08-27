// Global/FeeManagement/fee.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class FeeService {
  constructor(private prisma: PrismaService) {}

async createCategory(data: {
  name: string;
  description: string;
  bookingFee: string | number;
  feePerMile: string | number;
}) {
  const bookingFeeNum  =
    typeof data.bookingFee  === 'string'
      ? parseFloat(data.bookingFee)
      : data.bookingFee;
  const feePerMileNum =
    typeof data.feePerMile === 'string'
      ? parseFloat(data.feePerMile)
      : data.feePerMile;

  return this.prisma.feeCategory.create({
    data: {
      name:        data.name,
      description: data.description,
      bookingFee:  bookingFeeNum,
      feePerMile:  feePerMileNum,
    },
  });
}


  async getAllCategories() {
    return this.prisma.feeCategory.findMany();
  }

  async getCategory(id: number) {
    const category = await this.prisma.feeCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(
  id: number,
  updateData: Partial<{
    name: string;
    description: string;
    bookingFee: string | number;
    feePerMile: string | number;
  }>,
) {
  // 1. Ensure the category exists
  const category = await this.prisma.feeCategory.findUnique({ where: { id } });
  if (!category) throw new NotFoundException('Category not found');

  // 2. Build a clean payload, coercing strings to numbers
  const data: {
    name?: string;
    description?: string;
    bookingFee?: number;
    feePerMile?: number;
  } = {};

  if (updateData.name !== undefined) {
    data.name = updateData.name;
  }
  if (updateData.description !== undefined) {
    data.description = updateData.description;
  }
  if (updateData.bookingFee !== undefined) {
    const bf = typeof updateData.bookingFee === 'string'
      ? parseFloat(updateData.bookingFee)
      : updateData.bookingFee;
    if (isNaN(bf)) {
      throw new BadRequestException('bookingFee must be a number');
    }
    data.bookingFee = bf;
  }
  if (updateData.feePerMile !== undefined) {
    const fm = typeof updateData.feePerMile === 'string'
      ? parseFloat(updateData.feePerMile)
      : updateData.feePerMile;
    if (isNaN(fm)) {
      throw new BadRequestException('feePerMile must be a number');
    }
    data.feePerMile = fm;
  }

  // 3. Perform the update
  return this.prisma.feeCategory.update({
    where: { id },
    data,
  });
}


  async deleteCategory(id: number) {
    const category = await this.prisma.feeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.feeCategory.delete({ where: { id } });
  }
}
