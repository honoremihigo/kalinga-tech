import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import multer, { Multer } from 'multer';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, file: Express.Multer.File) {
    try {
      const filepath = `/uploads/members/profile/${file.filename}`;
      const member = await this.prisma.member.create({
        data: {
          profileImage: filepath,
          name: data.name,
          email: data.email,
          phone: data.phone,
          street: data.street,
          district:data.district,
          country: data.country,
          expectedMonthlyRides: data.expectedMonthlyRides,
          ridePurposes: data.ridePurposes,
          city: data.city,
        },
      });
      return { message: 'Member registered successfully', data: member };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const members = await this.prisma.member.findMany();
      return { message: 'All members retrieved', data: members };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const member = await this.prisma.member.findUnique({ where: { id } });
      if (!member) throw new NotFoundException('Member not found');
      return { message: 'Member retrieved', data: member };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      const member = await this.prisma.member.update({
        where: { id },
       data
      });
      return { message: 'Member updated successfully', data: member };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.member.delete({ where: { id } });
      return { message: 'Member deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
