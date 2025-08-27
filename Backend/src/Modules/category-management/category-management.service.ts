import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class CategoryManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; description: string }) {
    if (!data.name || !data.description) {
      throw new BadRequestException('Name and description are required');
    }

    const existing = await this.prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include:{
        fare:true,
      }
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  async update(
    id: number,
    data: Partial<{ name: string; description: string }>,
  ) {
    const existing = await this.prisma.category.findUnique({ where: {  id: Number(id) } });
    if (!existing) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.category.update({
      where: {  id: Number(id) },
      data,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.category.findUnique({ where: {  id: Number(id) } });
    if (!existing) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id: Number(id) },
    });
  }
}
