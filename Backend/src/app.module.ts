// app.module.ts
import { Module } from '@nestjs/common';
import { ReservationModule } from './Modules/Reservation/reservation.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';
import { DriverModule } from './Modules/DriverManagement/driver.module';
import { VehicleModule } from './Modules/VehicleManagement/vehicle.module';
import { FeeModule } from './Global/FeeManagement/fee.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ContactModule } from './Modules/Contact-us/contact.module';
import { LostPropertyModule } from './Modules/lost-property/lost-property.module';
import { FoundPropertyModule } from './Modules/FoundProperty/found-property.module';
import { AppController } from './app.controller';
import { WebhookController } from './Webhook/webhook.controller';
import { EmailModule } from './Global/Messages/email/email.module';
import { DriverApplicationModule } from './Modules/driver-application/driver-application.module';
import { PaymentModule } from './Global/Payment/payment.module';
import { StatsController } from './Webhook/stats.controller';
import { ClientModule } from './Modules/ClientManagement/ClientsModule/client.module';
import { RequestRideManagementModule } from './Modules/request-ride-management/request-ride-management.module';
import { CategoryManagementModule } from './Modules/category-management/category-management.module';
import { FareManagementModule } from './Modules/fare-management/fare-management.module';
import { EmployeeManagmentModule } from './Modules/employee-managment/employee-managment.module';

import { TaskManagementModule } from './Modules/task-management/task-management.module';  
import { ComplaintModule } from './Modules/ComplaintManagement/complaint.module';

import { LocationModule } from './Modules/location-management/location.module';
import { MemberModule } from './Modules/member-management/member.module';
import { FoundPropertiesModule } from './Modules/foundProperty-management/foundProperty.module';
import { ClaimantModule } from './Modules/claimant-management/claimant.module';
import { LostPropertiesModule } from './Modules/lostProperty-management/lostProperty.module';
import { BookingModule } from './Modules/booking-managment/booking.module';
import { MessageModule } from './Global/Messages/phone/message.module';
import { BlogModule } from './Modules/blog-managment/blog.module';
import { ProductModule } from './Modules/product-management/product.module';
@Module({
  
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
    ClientModule,
    ReservationModule,
    CommonModule,
    AdminModule,
    DriverModule,
    VehicleModule,
    FeeModule,
    ContactModule,
    LostPropertyModule,
    FoundPropertyModule,
    EmailModule,
    DriverApplicationModule,
    PaymentModule,
    RequestRideManagementModule,

    EmployeeManagmentModule,
     TaskManagementModule,
     ComplaintModule,

    CategoryManagementModule,
    FareManagementModule,
    EmployeeManagmentModule, 
    TaskManagementModule, 
    LocationModule,
    MemberModule,
    FoundPropertiesModule,
    ClaimantModule,
    LostPropertiesModule,
    BookingModule,
    MessageModule,
    BlogModule,
    ProductModule
 ],
  controllers:[AppController,WebhookController, StatsController],

  
})
export class AppModule {}
