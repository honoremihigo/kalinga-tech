import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.blog.create({ data });
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  async findAll() {
    try {
      return await this.prisma.blog.findMany({
        include: { admin: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  async findOne(id: string) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
        include: { admin: true },
      });
      if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
      return blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      await this.findOne(id); // Ensure it exists
      return await this.prisma.blog.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id); // Ensure it exists
      return await this.prisma.blog.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }
}
