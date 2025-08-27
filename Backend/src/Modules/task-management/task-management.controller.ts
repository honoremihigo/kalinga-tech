import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TaskManagementService } from './task-management.service';
import { AdminAuthGuard } from '../../Guards/AdminAuth.guard';

@Controller('task')
@UseGuards(AdminAuthGuard)
export class TaskManagementController {
  constructor(private readonly taskServices: TaskManagementService) {}
  @Post('create')
  async registerTask(@Body() data) {
    try {
      return await this.taskServices.registerTask(data);
    } catch (error) {
      console.error('error registering a task', error);
      throw new Error(error.message);
    }
  }

  @Get('all')
  async getAllTasks() {
    try {
      return await this.taskServices.getAllTasks();
    } catch (error) {
      console.error('error getting tasks', error);
      throw new Error(error.message);
    }
  }
}