import { Injectable } from '@nestjs/common';
import { BaseResponse } from '../shared/classes/base-response';
import { CityRepository } from './repositories/city.repository';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from './models/city.model';
import { CityEntity } from './entities/city.entity';
import {
  CITY_CREATE_ERROR,
  CITY_FIND_ERROR,
  CITY_UPDATE_ERROR,
} from '../shared/errors/city.errors';
import {
  CITY_CREATE,
  CITY_DELETED,
  CITY_FIND,
  CITY_FIND_ALL,
  CITY_UPDATED,
} from '../shared/messages/city.messages';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async createCity(dto: CreateCityDto): Promise<BaseResponse<City>> {
    const city = new CityEntity({
      name: dto.name,
    });

    const createdCity = await this.cityRepository.create(city);

    if (!createdCity) {
      throw new Error(CITY_CREATE_ERROR);
    }

    return new BaseResponse<City>(CITY_CREATE, createdCity);
  }

  async findAll(): Promise<BaseResponse<City[]>> {
    const cities = await this.cityRepository.findAll();

    if (!cities) {
      throw new Error(CITY_FIND_ERROR);
    }
    return new BaseResponse<City[]>(CITY_FIND_ALL, cities);
  }

  async findById(id: number): Promise<BaseResponse<City>> {
    const city = await this.cityRepository.findById(id);

    if (!city) {
      throw new Error(CITY_FIND_ERROR);
    }
    return new BaseResponse<City>(CITY_FIND, city);
  }

  async delete(id: number): Promise<BaseResponse<void>> {
    await this.cityRepository.delete(id);
    return new BaseResponse<void>(CITY_DELETED);
  }

  async update(id: number, dto: UpdateCityDto): Promise<BaseResponse<void>> {
    const city = new CityEntity({
      name: dto.name,
    });

    const updatedCity = await this.cityRepository.update(id, city);

    if (!updatedCity) {
      throw new Error(CITY_UPDATE_ERROR);
    }

    return new BaseResponse<void>(CITY_UPDATED);
  }
}
