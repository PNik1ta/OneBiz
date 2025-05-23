import { Injectable } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { EBookingStatuses } from '../shared/enums/booking-statuses.enum';
import {
  BOOKING_CREATE_ERROR,
  BOOKING_FIND_ERROR,
  BOOKING_PERMISSIONS_DELETE_ERROR,
  BOOKING_PERMISSIONS_UPDATE_ERROR,
  BOOKING_UPDATE_ERROR,
} from '../shared/errors/booking.errors';
import { BaseResponse } from '../shared/classes/base-response';
import {
  BOOKING_CREATE,
  BOOKING_DELETED,
  BOOKING_FIND,
  BOOKING_FIND_ALL,
  BOOKING_UPDATED,
} from '../shared/messages/booking.messages';
import { Booking } from './models/booking.model';
import { BusinessRepository } from '../business/repositories/business.repository';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BUSINESS_FIND_ERROR } from '../shared/errors/business.errors';
import { VerificationService } from '../mail/verification.service';
import { ServiceRepository } from '../service/repositories/service.repository';
import { SERVICE_FIND_ERROR } from '../shared/errors/service.errors';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly businessRepository: BusinessRepository,
    private readonly verificationService: VerificationService,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async createBooking(
    dto: CreateBookingDto,
    userId: number,
  ): Promise<BaseResponse<Booking>> {
    const booking = new BookingEntity({
      datetime: new Date(dto.datetime),
      user_id: userId,
      business_id: dto.business_id,
      service_id: dto.service_id,
      description: dto.description,
      status: EBookingStatuses.CREATED,
      amount: 0,
    });

    const createdBooking = await this.bookingRepository.create(booking);

    if (!createdBooking) {
      throw new Error(BOOKING_CREATE_ERROR);
    }

    try {
      const business = await this.businessRepository.findById(dto.business_id);

      if (!business) {
        throw new Error(BUSINESS_FIND_ERROR);
      }

      const service = await this.serviceRepository.findById(dto.service_id);

      if (!service) {
        throw new Error(SERVICE_FIND_ERROR);
      }

      await this.verificationService.sendBookingMessage(
        business.user_email,
        `сервис: ${service.title}, дата: ${new Date(dto.datetime).toISOString()}`,
      );
    } catch (err) {
      console.error(err);
    }

    return new BaseResponse<Booking>(BOOKING_CREATE, createdBooking);
  }

  async findAll(): Promise<BaseResponse<Booking[]>> {
    const bookings = await this.bookingRepository.findAll();

    if (!bookings) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    return new BaseResponse<Booking[]>(BOOKING_FIND_ALL, bookings);
  }

  async findById(id: number): Promise<BaseResponse<Booking>> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    return new BaseResponse<Booking>(BOOKING_FIND, booking);
  }

  async findByBusinessId(businessId: number): Promise<BaseResponse<Booking[]>> {
    const bookings = await this.bookingRepository.findByBusinessId(businessId);

    if (!bookings) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    return new BaseResponse<Booking[]>(BOOKING_FIND_ALL, bookings);
  }

  async findByUserId(userId: number): Promise<BaseResponse<Booking[]>> {
    const bookings = await this.bookingRepository.findByUserId(userId);

    if (!bookings) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    return new BaseResponse<Booking[]>(BOOKING_FIND_ALL, bookings);
  }

  async delete(id: number, userId: number): Promise<BaseResponse<void>> {
    const booking = await this.bookingRepository.findById(id);
    const business = await this.businessRepository.findByUserId(userId);

    if (!booking) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    if (
      booking.business_id !== business.id ||
      ![
        EBookingStatuses.CANCELED,
        EBookingStatuses.FINISHED,
        EBookingStatuses.NO_SHOW,
      ].includes(booking.status)
    ) {
      throw new Error(BOOKING_PERMISSIONS_DELETE_ERROR);
    }
    await this.bookingRepository.delete(id);
    return new BaseResponse<void>(BOOKING_DELETED);
  }

  async update(
    id: number,
    dto: UpdateBookingDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error(BOOKING_FIND_ERROR);
    }

    const business = await this.businessRepository.findById(
      booking.business_id,
    );

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    if (booking.user_id === userId || business.user_id === userId) {
      const bookingEntity = new BookingEntity({
        id: booking.id,
        datetime: new Date(dto.datetime),
        user_id: booking.user_id,
        business_id: booking.business_id,
        service_id: dto.service_id,
        description: dto.description,
        status: dto.status,
        amount: dto.amount ?? booking.amount ?? 0,
      });

      const updatedBooking = await this.bookingRepository.update(
        id,
        bookingEntity,
      );

      if (!updatedBooking) {
        throw new Error(BOOKING_UPDATE_ERROR);
      }

      return new BaseResponse<void>(BOOKING_UPDATED);
    } else {
      throw new Error(BOOKING_PERMISSIONS_UPDATE_ERROR);
    }
  }
}
