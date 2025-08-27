import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

async create(data: any) {

  return this.prisma.complaint.create({ data });
}

  async findAll() {
    return this.prisma.complaint.findMany({
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.complaint.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.complaint.delete({
      where: { id },
    });
  }
}
