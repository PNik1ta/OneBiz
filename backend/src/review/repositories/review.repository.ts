import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../models/review.model';
import { Repository, UpdateResult } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { User } from '../../user/models/user.model';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(review: ReviewEntity): Promise<Review> {
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndMapOne(
        'review.user',
        User,
        'user',
        'user.id = review.user_id',
      )
      .select([
        'review.id AS id',
        'review.booking_business_id AS booking_business_id',
        'review.type AS type',
        'review.title AS title',
        'review.rating AS rating',
        'review.description AS description',
        'review.created_at AS created_at',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .getRawMany();
  }

  async findByBookingBusinessId(bookingBusinessId: number): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndMapOne(
        'review.user',
        User,
        'user',
        'user.id = review.user_id',
      )
      .select([
        'review.id AS id',
        'review.booking_business_id AS booking_business_id',
        'review.type AS type',
        'review.title AS title',
        'review.rating AS rating',
        'review.description AS description',
        'review.created_at AS created_at',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .where('review.booking_business_id = :booking_business_id', {
        booking_business_id: bookingBusinessId,
      })
      .getRawMany();
  }

  async findById(id: number): Promise<Review> {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndMapOne(
        'review.user',
        User,
        'user',
        'user.id = review.user_id',
      )
      .select([
        'review.id AS id',
        'review.booking_business_id AS booking_business_id',
        'review.type AS type',
        'review.title AS title',
        'review.rating AS rating',
        'review.description AS description',
        'review.created_at AS created_at',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .where('review.id = :id', {
        id,
      })
      .getRawOne();
  }

  async delete(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }

  async update(id: number, review: ReviewEntity): Promise<UpdateResult> {
    return await this.reviewRepository.update({ id }, review);
  }
}
