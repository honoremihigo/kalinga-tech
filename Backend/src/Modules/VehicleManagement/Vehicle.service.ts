import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (data.ownerId && !isNaN(Number(data.ownerId))) {
      data.ownerId = Number(data.ownerId);
    } else {
      delete data.ownerId;
    }

    if (data.registrationDate) data.registrationDate = new Date(data.registrationDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);
    if (data.insuranceExpiry) data.insuranceExpiry = new Date(data.insuranceExpiry);

    return this.prisma.vehicle.create({ data });
  }

  async updateCategory(vehicleId: string, categoryName: string) {
    const id = Number(vehicleId);  // Convert to number here
    if (isNaN(id)) {
      throw new Error('Invalid vehicle ID');
    }

  const vehicle = await this.prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    throw new NotFoundException('Vehicle not found');
  }

  return this.prisma.vehicle.update({
    where: { id },
    data: { category: categoryName },
  });
}



  async findAll() {
    const vehicles = await this.prisma.vehicle.findMany();
    const drivers = await this.prisma.driver.findMany({
      select: { id: true, firstName: true, lastName: true },
    });

    return vehicles.map(vehicle => {
      const owner = drivers.find(driver => driver.id === vehicle.ownerId);
      return {
        ...vehicle,
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
      };
    });
  }

  async findOne(id: number) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    if (data.ownerId && !isNaN(Number(data.ownerId))) {
      data.ownerId = Number(data.ownerId);
    } else {
      delete data.ownerId;
    }

    if (data.registrationDate) data.registrationDate = new Date(data.registrationDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);
    if (data.insuranceExpiry) data.insuranceExpiry = new Date(data.insuranceExpiry);

    return this.prisma.vehicle.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
