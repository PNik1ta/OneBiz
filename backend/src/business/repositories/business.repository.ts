import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../models/business.model';
import { BusinessEntity } from '../entities/business.entity';
import { Repository, UpdateResult } from 'typeorm';
import { City } from '../../city/models/city.model';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async create(business: BusinessEntity): Promise<Business> {
    return this.businessRepository.save(business);
  }

  async findAll(): Promise<Business[]> {
    const rawBusinesses = await this.businessRepository
      .createQueryBuilder('business')
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .select([
        'business.id AS id',
        'business.company_name AS company_name',
        'business.company_description AS company_description',
        'business.preview_images_url AS preview_images_url',
        'business.user_id AS user_id',
        'business.city_id AS city_id',
        'business.place AS place',
      ])
      .addSelect('city.name AS city_name')
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'review_count')
      .getRawMany();

    const mapped: any = rawBusinesses.map((raw) => ({
      id: raw.id,
      company_name: raw.company_name,
      company_description: raw.company_description,
      preview_images_url: raw.preview_images_url,
      user_id: raw.user_id,
      city_id: raw.city_id,
      place: raw.place,
      city_name: raw.city_name,
      avg_rating: Number(raw.avg_rating) || 0,
      review_count: Number(raw.review_count) || 0,
    }));

    return mapped;
  }

  async findById(id: number): Promise<Business> {
    const raw = await this.businessRepository
      .createQueryBuilder('business')
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .select([
        'business.id AS id',
        'business.company_name AS company_name',
        'business.company_description AS company_description',
        'business.preview_images_url AS preview_images_url',
        'business.user_id AS user_id',
        'business.city_id AS city_id',
        'business.place AS place',
      ])
      .addSelect('city.name AS city_name')
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'review_count')
      .where('business.id = :business_id', { business_id: id })
      .getRawOne();

    const mapped = {
      id: raw.id,
      company_name: raw.company_name,
      company_description: raw.company_description,
      preview_images_url: raw.preview_images_url,
      user_id: raw.user_id,
      city_id: raw.city_id,
      place: raw.place,
      city_name: raw.city_name,
      avg_rating: Number(raw.avg_rating) || 0,
      review_count: Number(raw.review_count) || 0,
    };

    return mapped;
  }

  async findByUserId(userId: number): Promise<Business> {
    const raw = await this.businessRepository
      .createQueryBuilder('business')
      .leftJoinAndMapOne(
        'business.city',
        City,
        'city',
        'city.id = business.city_id',
      )
      .select([
        'business.id AS id',
        'business.company_name AS company_name',
        'business.company_description AS company_description',
        'business.preview_images_url AS preview_images_url',
        'business.user_id AS user_id',
        'business.city_id AS city_id',
        'business.place AS place',
      ])
      .addSelect('city.name AS city_name')
      .addSelect((subQuery) => {
        return subQuery
          .select('AVG(review.rating)', 'avg')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'avg_rating')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('review', 'review')
          .where('review.booking_business_id = business.id')
          .andWhere(`review.type = 'business'`);
      }, 'review_count')
      .where('business.user_id = :user_id', { user_id: userId })
      .getRawOne();

    const mapped = {
      id: raw.id,
      company_name: raw.company_name,
      company_description: raw.company_description,
      preview_images_url: raw.preview_images_url,
      user_id: raw.user_id,
      city_id: raw.city_id,
      place: raw.place,
      city_name: raw.city_name,
      avg_rating: Number(raw.avg_rating) || 0,
      review_count: Number(raw.review_count) || 0,
    };

    return mapped;
  }

  async delete(id: number): Promise<void> {
    await this.businessRepository.delete(id);
  }

  async update(id: number, business: BusinessEntity): Promise<UpdateResult> {
    return this.businessRepository.update({ id }, business);
  }
}
