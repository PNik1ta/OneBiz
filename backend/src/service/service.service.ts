import { unlink } from 'fs/promises';
import { BusinessRepository } from '../business/repositories/business.repository';
import { BaseResponse } from '../shared/classes/base-response';
import { BUSINESS_FIND_ERROR } from '../shared/errors/business.errors';
import {
  SERVICE_CREATE_ERROR,
  SERVICE_FIND_ERROR,
  SERVICE_PERMISSIONS_UPDATE_ERROR,
  SERVICE_UPDATE_ERROR,
} from '../shared/errors/service.errors';
import {
  SERVICE_CREATE,
  SERVICE_DELETED,
  SERVICE_FIND,
  SERVICE_FIND_ALL,
  SERVICE_UPDATED,
} from '../shared/messages/service.messages';
import { CreateServiceDto } from './dto/create-service';
import { UpdateServiceDto } from './dto/update-service';
import { ServiceEntity } from './enities/service.entity';
import { Service } from './models/service.model';
import { ServiceRepository } from './repositories/service.repository';
import * as path from 'path';

export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly businessRepository: BusinessRepository,
  ) {}

  async createService(
    dto: CreateServiceDto,
    userId: number,
  ): Promise<BaseResponse<Service>> {
    const business = await this.businessRepository.findByUserId(userId);
    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    const service = new ServiceEntity({
      title: dto.title,
      description: dto.description ?? '',
      background_url: dto.background_url,
      business_id: business.id,
      amount: dto.amount,
      discount: dto.discount ?? 0,
    });

    const createdService = await this.serviceRepository.create(service);

    if (!createdService) {
      throw new Error(SERVICE_CREATE_ERROR);
    }

    return new BaseResponse<Service>(SERVICE_CREATE, createdService);
  }

  async findAll(): Promise<BaseResponse<Service[]>> {
    const services = await this.serviceRepository.findAll();

    if (!services) {
      throw new Error(SERVICE_FIND_ERROR);
    }

    return new BaseResponse<Service[]>(SERVICE_FIND_ALL, services);
  }

  async findByBusinessId(businessId: number): Promise<BaseResponse<Service[]>> {
    const services = await this.serviceRepository.findByBusinessId(businessId);

    if (!services) {
      throw new Error(SERVICE_FIND_ERROR);
    }

    return new BaseResponse<Service[]>(SERVICE_FIND_ALL, services);
  }

  async findById(id: number): Promise<BaseResponse<Service>> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new Error(SERVICE_FIND_ERROR);
    }

    return new BaseResponse<Service>(SERVICE_FIND, service);
  }

  async delete(id: number): Promise<BaseResponse<void>> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new Error(SERVICE_FIND_ERROR);
    }

    if (service.background_url) {
      const lastSlashIndex = service.background_url.lastIndexOf('/');
      const secondLastSlashIndex = service.background_url.lastIndexOf(
        '/',
        lastSlashIndex - 1,
      );
      const fileRelativePath = service.background_url.substring(
        secondLastSlashIndex + 1,
      );
      const filePath = `${path.resolve(__dirname, '../../../')}/uploads/${fileRelativePath}`;
      try {
        await unlink(filePath);
      } catch (error) {
        // Handle errors, possibly logging them
        console.error('Error deleting file:', error);
        return new BaseResponse<void>(JSON.stringify(error));
      }
    }

    await this.serviceRepository.delete(id);
    return new BaseResponse<void>(SERVICE_DELETED);
  }

  async update(
    id: number,
    dto: UpdateServiceDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new Error(SERVICE_FIND_ERROR);
    }

    const business = await this.businessRepository.findById(
      service.business_id,
    );

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    if (business.user_id !== userId) {
      throw new Error(SERVICE_PERMISSIONS_UPDATE_ERROR);
    }

    const serviceEntity = new ServiceEntity({
      id: service.id,
      title: dto.title,
      description: dto.description ?? service.description,
      background_url: dto.background_url ?? service.background_url,
      amount: dto.amount,
      discount: dto.discount ?? service.discount,
      business_id: service.business_id,
    });

    const updatedService = await this.serviceRepository.update(
      id,
      serviceEntity,
    );

    if (!updatedService) {
      throw new Error(SERVICE_UPDATE_ERROR);
    }

    return new BaseResponse<void>(SERVICE_UPDATED);
  }
}
