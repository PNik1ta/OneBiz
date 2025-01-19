import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingRepository } from './repositories/booking.repository';
import { BookingService } from './booking.service';
import { Booking } from './models/booking.model';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [BookingController],
  providers: [BookingRepository, BookingService],
  exports: [BookingRepository, BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => BusinessModule),
  ],
})
export class BookingModule {}
