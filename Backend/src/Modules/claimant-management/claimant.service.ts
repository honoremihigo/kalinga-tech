import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class ClaimantService {
  constructor(private prisma: PrismaService) {}

  // Create a new claimant
  async create(data: any) {
    try {
      const claimant = await this.prisma.claimant.create({ data });
      return { message: 'Claim submitted successfully', data: claimant };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get all claimants
  async findAll() {
    try {
      const claimants = await this.prisma.claimant.findMany({
        include: {
          foundProperty: true,
          approvedFor: true,
        },
      });
      return { message: 'Claimants retrieved successfully', data: claimants };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get one claimant by ID
  async findOne(id: string) {
    try {
      const claimant = await this.prisma.claimant.findUnique({
        where: { id },
        include: {
          foundProperty: true,
          approvedFor: true,
        },
      });
      if (!claimant) throw new NotFoundException('Claimant not found');
      return { message: 'Claimant retrieved successfully', data: claimant };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update claimant
  async update(id: string, data: any) {
    try {
      const claimant = await this.prisma.claimant.update({
        where: { id },
        data,
      });
      return { message: 'Claimant updated successfully', data: claimant };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Delete claimant
  async remove(id: string) {
    try {
      await this.prisma.claimant.delete({ where: { id } });
      return { message: 'Claimant deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
