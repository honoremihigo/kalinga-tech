import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    is_favorite?: boolean;
  }) {
    try {
      const location = await this.prisma.location.create({
        data,
      });
      return {
        message: 'Location created successfully',
        data: location,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create location: ' + error.message);
    }
  }

  // FIND ALL
  async findAll() {
    try {
      const locations = await this.prisma.location.findMany();
      return {
        message: 'Locations retrieved successfully',
        data: locations,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve locations: ' + error.message);
    }
  }

  // FIND ONE
  async findOne(location_id: string) {
    try {
      const location = await this.prisma.location.findUnique({
        where: { location_id },
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      return {
        message: 'Location retrieved successfully',
        data: location,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve location: ' + error.message);
    }
  }

  // UPDATE
  async update(location_id: string, data: {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    created_by?: string;
    is_favorite?: boolean;
  }) {
    try {
      const location = await this.prisma.location.update({
        where: { location_id },
        data,
      });
      return {
        message: 'Location updated successfully',
        data: location,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma throws P2025 if record not found for update
        throw new NotFoundException('Location not found');
      }
      throw new BadRequestException('Failed to update location: ' + error.message);
    }
  }

  // DELETE
  async remove(location_id: string) {
    try {
      await this.prisma.location.delete({
        where: { location_id },
      });
      return {
        message: 'Location deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Location not found');
      }
      throw new BadRequestException('Failed to delete location: ' + error.message);
    }
  }
}
