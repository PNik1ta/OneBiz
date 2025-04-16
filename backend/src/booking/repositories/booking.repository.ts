import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../models/booking.model';
import { Repository, UpdateResult } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { User } from '../../user/models/user.model';
import { Business } from '../../business/models/business.model';
import { Service } from '../../service/models/service.model';
import { Injectable } from '@nestjs/common';
import { City } from '../../city/models/city.model';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(booking: BookingEntity): Promise<Booking> {
    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndMapOne(
        'booking.user',
        User,
        'user',
        'user.id = booking.user_id',
      )
      .leftJoinAndMapOne(
        'booking.business',
        Business,
        'business',
        'business.id = booking.business_id',
      )
      .leftJoinAndMapOne(
        'booking.service',
        Service,
        'service',
        'service.id = booking.service_id',
      )
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'review_count')
      .select([
        'booking.id AS id',
        'booking.datetime AS datetime',
        'booking.description AS description',
        'booking.status AS status',
        'booking.amount AS amount',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .addSelect('user.phone AS user_phone')
      .addSelect('user.email AS user_email')
      .addSelect('business.company_name AS company_name')
      .addSelect('business.place AS business_place')
      .addSelect('city.name AS business_city')
      .addSelect('business.id AS business_id')
      .addSelect('service.title AS service')
      .addSelect('service.amount AS service_amount')
      .addSelect('service.discount AS service_discount')
      .addSelect('service.id AS service_id')
      .getRawMany();
  }

  async findById(id: number): Promise<Booking> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndMapOne(
        'booking.user',
        User,
        'user',
        'user.id = booking.user_id',
      )
      .leftJoinAndMapOne(
        'booking.business',
        Business,
        'business',
        'business.id = booking.business_id',
      )
      .leftJoinAndMapOne(
        'booking.service',
        Service,
        'service',
        'service.id = booking.service_id',
      )
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'review_count')
      .select([
        'booking.id AS id',
        'booking.datetime AS datetime',
        'booking.description AS description',
        'booking.status AS status',
        'booking.amount AS amount',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .addSelect('user.phone AS user_phone')
      .addSelect('user.email AS user_email')
      .addSelect('business.company_name AS company_name')
      .addSelect('business.place AS business_place')
      .addSelect('city.name AS business_city')
      .addSelect('business.id AS business_id')
      .addSelect('service.title AS service')
      .addSelect('service.amount AS service_amount')
      .addSelect('service.discount AS service_discount')
      .addSelect('service.id AS service_id')
      .where('booking.id = :booking_id', { booking_id: id })
      .getRawOne();
  }

  async findByBusinessId(businessId: number): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndMapOne(
        'booking.user',
        User,
        'user',
        'user.id = booking.user_id',
      )
      .leftJoinAndMapOne(
        'booking.business',
        Business,
        'business',
        'business.id = booking.business_id',
      )
      .leftJoinAndMapOne(
        'booking.service',
        Service,
        'service',
        'service.id = booking.service_id',
      )
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'booking'`);
      }, 'review_count')
      .select([
        'booking.id AS id',
        'booking.datetime AS datetime',
        'booking.description AS description',
        'booking.status AS status',
        'booking.amount AS amount',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .addSelect('user.phone AS user_phone')
      .addSelect('user.email AS user_email')
      .addSelect('business.company_name AS company_name')
      .addSelect('business.place AS business_place')
      .addSelect('city.name AS business_city')
      .addSelect('business.id AS business_id')
      .addSelect('service.title AS service')
      .addSelect('service.amount AS service_amount')
      .addSelect('service.discount AS service_discount')
      .addSelect('service.id AS service_id')
      .where('booking.business_id = :business_id', { business_id: businessId })
      .getRawMany();
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndMapOne(
        'booking.user',
        User,
        'user',
        'user.id = booking.user_id',
      )
      .leftJoinAndMapOne(
        'booking.business',
        Business,
        'business',
        'business.id = booking.business_id',
      )
      .leftJoinAndMapOne(
        'booking.service',
        Service,
        'service',
        'service.id = booking.service_id',
      )
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'BOOKING'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = booking.id')
          .andWhere(`review.type = 'BOOKING'`);
      }, 'review_count')
      .select([
        'booking.id AS id',
        'booking.datetime AS datetime',
        'booking.description AS description',
        'booking.status AS status',
        'booking.amount AS amount',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .addSelect('user.phone AS user_phone')
      .addSelect('user.email AS user_email')
      .addSelect('business.company_name AS company_name')
      .addSelect('business.place AS business_place')
      .addSelect('city.name AS business_city')
      .addSelect('business.id AS business_id')
      .addSelect('service.title AS service')
      .addSelect('service.amount AS service_amount')
      .addSelect('service.discount AS service_discount')
      .addSelect('service.id AS service_id')
      .where('booking.user_id = :user_id', { user_id: userId })
      .getRawMany();
  }

  async delete(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  async update(id: number, booking: BookingEntity): Promise<UpdateResult> {
    return this.bookingRepository.update({ id }, booking);
  }
}
