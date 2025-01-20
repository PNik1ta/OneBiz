import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './shared/guards/at.guard';
import { BusinessModule } from './business/business.module';
import { FilesModule } from './file/file.module';
import { BookingModule } from './booking/booking.module';
import { ServiceModule } from './service/service.module';
import { User } from './user/models/user.model';
import { Business } from './business/models/business.model';
import { Booking } from './booking/models/booking.model';
import { Service } from './service/models/service.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      entities: [User, Business, Booking, Service],
    }),
    FilesModule,
    UserModule,
    AuthModule,
    BusinessModule,
    BookingModule,
    ServiceModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
