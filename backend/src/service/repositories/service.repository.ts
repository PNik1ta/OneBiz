import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../models/service.model';
import { Repository, UpdateResult } from 'typeorm';
import { ServiceEntity } from '../enities/service.entity';

export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(service: ServiceEntity): Promise<Service> {
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findByBusinessId(business_id: number): Promise<Service[]> {
    return this.serviceRepository.findBy({ business_id });
  }

  async findById(id: number): Promise<Service> {
    return this.serviceRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  async update(id: number, service: ServiceEntity): Promise<UpdateResult> {
    return await this.serviceRepository.update({ id }, service);
  }
}
