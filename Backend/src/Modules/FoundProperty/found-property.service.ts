import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class FoundPropertyService {
  constructor(private prisma: PrismaService) {}

  async createFoundProperty(data: any) {
    return this.prisma.foundProperty.create({ data });
  }

  async getAllFoundProperties() {
    return this.prisma.foundProperty.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFoundPropertyById(id: number) {
    const found = await this.prisma.foundProperty.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Found property with id ${id} not found`);
    }
    return found;
  }

  async updateFoundProperty(id: number, data: any) {
    await this.getFoundPropertyById(id); // Throws if not found
    return this.prisma.foundProperty.update({
      where: { id },
      data,
    });
  }

  async deleteFoundProperty(id: number) {
    await this.getFoundPropertyById(id); // Throws if not found
    return this.prisma.foundProperty.delete({ where: { id } });
  }

  async deliverFoundProperty(id: number) {
    await this.getFoundPropertyById(id);
    return this.prisma.foundProperty.update({
      where: { id },
      data: { status: 'delivered' },
    });
  }
}
