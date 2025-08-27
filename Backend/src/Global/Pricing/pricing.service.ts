import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { FeeCategory } from 'generated/prisma';


@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch fee category by car category ID
   */
 async getFeeCategoryById(carCategoryId: number) {
  const feeCategory = await this.prisma.feeCategory.findUnique({
    where: { id: carCategoryId },
  });

  if (!feeCategory) {
    throw new NotFoundException('Fee category not found for given car category ID');
  }

  return feeCategory;
}

  /**
   * Calculate total price:
   * (bookingFee + feePerMile × distanceKm) × numberOfPassengers
   */
  calculatePrice({
    distanceKm,
    feeCategory,
    numberOfPassengers,
  }: {
    distanceKm: number;
    feeCategory: FeeCategory;
    numberOfPassengers?: number;
  }): number {
    const baseFare = feeCategory.bookingFee;
    const perKmRate = feeCategory.feePerMile;
    const total = (baseFare + distanceKm * perKmRate);
    return Math.round(total * 100) / 100;
  }

  /**
   * Fetch fee category and calculate total ride price
   */
  async getTotalPrice({
    carCategoryId,
    distanceKm,
    numberOfPassengers,
  }: {
    carCategoryId: number;
    distanceKm: number;
    numberOfPassengers: number;
  }): Promise<{
    price: number;
    feeCategory: FeeCategory;
  }> {
    const feeCategory = await this.getFeeCategoryById(carCategoryId);
    const price = this.calculatePrice({
      distanceKm,
      feeCategory,
      numberOfPassengers,
    });

    return { 
      price,
      feeCategory,
    };
  }
}
