import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../models/business.model';
import { BusinessEntity } from '../entities/business.entity';
import { Repository, UpdateResult } from 'typeorm';

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
    return this.businessRepository.find();
  }

  async findById(id: number): Promise<Business> {
    return this.businessRepository.findOneBy({ id: id });
  }

  async findByUserId(userId: number): Promise<Business> {
    return this.businessRepository.findOneBy({ user_id: userId });
  }

  async delete(id: number): Promise<void> {
    await this.businessRepository.delete(id);
  }

  async update(id: number, business: BusinessEntity): Promise<UpdateResult> {
    return this.businessRepository.update({ id }, business);
  }
}
