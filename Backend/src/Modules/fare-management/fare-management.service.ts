import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class FareManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const requiredFields = [
      'categoryId',
      'fromDay',
      'tillDay',
      'fromTime',
      'tillTime',
      'startRate',
      'startRatePerMile',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new BadRequestException(`${field} is required`);
      }
    }

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.fare.create({ data: {
        ...data,
        startRate: Number(data.startRate),
        startRatePerMile: Number(data.startRatePerMile)
    } });
  }

  async findAll() {
    return this.prisma.fare.findMany({
      include: { category: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const fare = await this.prisma.fare.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!fare) {
      throw new BadRequestException('Fare not found');
    }

    return fare;
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.fare.findUnique({ where: { id: Number(id)} });
    if (!existing) {
      throw new BadRequestException('Fare not found');
    }

    return this.prisma.fare.update({
      where: { id: Number(id) },
      data: {
        ...data,
        startRate: Number(data.startRate),
        startRatePerMile: Number(data.startRatePerMile)
      }
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.fare.findUnique({ where: { id: Number(id)} });
    if (!existing) {
      throw new BadRequestException('Fare not found');
    }

    return this.prisma.fare.delete({ where: { id: Number(id) } });
  }
}
