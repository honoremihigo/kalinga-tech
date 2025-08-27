import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmployeeManagmentService } from './employee-managment.service';
import { AdminAuthGuard } from '../../Guards/AdminAuth.guard';

@Controller('employee')
export class EmployeeManagmentController {
  constructor(private readonly employeeServices: EmployeeManagmentService) {}

  @Post('register')
  @UseGuards(AdminAuthGuard)
  async registerEmployee(@Body() data) {
    try {
      return await this.employeeServices.registerEmployee(data);
    } catch (error) {
      console.error('error registering a employee', error);
      throw new Error(error.message);
    }
  }

  @Get('all')
  @UseGuards(AdminAuthGuard)
  async getAllEmployee() {
    try {
        return await this.employeeServices.getAllEmployee();
    } catch (error) {
      console.error('error getting   employees', error);
      throw new Error(error.message);
    }
  }


  @Post('assign-task')
  @UseGuards(AdminAuthGuard)
  async assignTakToEmployee(@Body() data){
    try {
        return await this.employeeServices.assignTasks(data)
    } catch (error) {
        console.error('error assigning task   employees', error);
      throw new Error(error.message);
    }
  }
}