import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { City } from '../models/city.model';
import { CityEntity } from '../entities/city.entity';

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(tag: CityEntity): Promise<City> {
    return this.cityRepository.save(tag);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async findById(id: number): Promise<City> {
    return this.cityRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.cityRepository.delete(id);
  }

  async update(id: number, business: CityEntity): Promise<UpdateResult> {
    return this.cityRepository.update({ id }, business);
  }
}
