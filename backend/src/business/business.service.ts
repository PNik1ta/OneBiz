import { Injectable } from '@nestjs/common';
import { BusinessRepository } from './repositories/business.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { Business } from './models/business.model';
import { BusinessEntity } from './entities/business.entity';
import {
  BUSINESS_CREATE_ERROR,
  BUSINESS_FIND_ERROR,
  BUSINESS_PERMISSIONS_UPDATE_ERROR,
  BUSINESS_UPDATE_ERROR,
} from '../shared/errors/business.errors';
import {
  BUSINESS_CREATE,
  BUSINESS_DELETED,
  BUSINESS_FIND,
  BUSINESS_FIND_ALL,
  BUSINESS_UPDATED,
} from '../shared/messages/business.messages';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { ERoles } from '../shared/enums/roles.enum';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createBusiness(
    dto: CreateBusinessDto,
    userId: number,
  ): Promise<BaseResponse<Business>> {
    const business = new BusinessEntity({
      company_name: dto.company_name,
      company_description: dto.company_description,
      preview_images_url: dto.preview_images_url ?? [],
      user_id: userId,
    });

    const createdBusiness = await this.businessRepository.create(business);

    if (!createdBusiness) {
      throw new Error(BUSINESS_CREATE_ERROR);
    }

    return new BaseResponse<Business>(BUSINESS_CREATE, createdBusiness);
  }

  async findAll(): Promise<BaseResponse<Business[]>> {
    const businesses = await this.businessRepository.findAll();

    if (!businesses) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    return new BaseResponse<Business[]>(BUSINESS_FIND_ALL, businesses);
  }

  async findById(id: number): Promise<BaseResponse<Business>> {
    const business = await this.businessRepository.findById(id);

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    return new BaseResponse<Business>(BUSINESS_FIND, business);
  }

  async findByUserId(userId: number): Promise<BaseResponse<Business>> {
    const business = await this.businessRepository.findByUserId(userId);

    return new BaseResponse<Business>(BUSINESS_FIND, business);
  }

  async delete(id: number): Promise<BaseResponse<void>> {
    const business = await this.businessRepository.findById(id);

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    // Extract the relative file path starting from the second last slash
    for (const bg of business.preview_images_url) {
      const lastSlashIndex = bg.lastIndexOf('/');
      const secondLastSlashIndex = bg.lastIndexOf('/', lastSlashIndex - 1);
      const fileRelativePath = bg.substring(secondLastSlashIndex + 1);
      const filePath = `${path.resolve(__dirname, '../../../')}/uploads/${fileRelativePath}`;
      try {
        await unlink(filePath);
      } catch (error) {
        // Handle errors, possibly logging them
        console.error('Error deleting file:', error);
      }
    }

    await this.businessRepository.delete(id);
    return new BaseResponse<void>(BUSINESS_DELETED);
  }

  async update(
    id: number,
    dto: UpdateBusinessDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const business = await this.businessRepository.findById(id);
    const user = await this.userRepository.findById(userId);

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    if (userId !== business.user_id || user?.role !== ERoles.ADMIN) {
      throw new Error(BUSINESS_PERMISSIONS_UPDATE_ERROR);
    }

    const businessEntity = new BusinessEntity({
      id: business.id,
      company_name: dto.company_name,
      company_description: dto.company_description,
      preview_images_url: dto.preview_images_url,
      user_id: business.user_id,
    });

    const updatedBusiness = await this.businessRepository.update(
      id,
      businessEntity,
    );

    if (!updatedBusiness) {
      throw new Error(BUSINESS_UPDATE_ERROR);
    }

    return new BaseResponse<void>(BUSINESS_UPDATED);
  }
}
