import { Injectable } from '@nestjs/common';
import { TagRepository } from './repositories/tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { Tag } from './models/tag.model';
import { TagEntity } from './entities/tag.entity';
import {
  TAG_CREATE_ERROR,
  TAG_FIND_ERROR,
  TAG_UPDATE_ERROR,
} from '../shared/errors/tag.errors';
import {
  TAG_CREATE,
  TAG_DELETED,
  TAG_FIND,
  TAG_FIND_ALL,
  TAG_UPDATED,
} from '../shared/messages/tag.messages';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(dto: CreateTagDto): Promise<BaseResponse<Tag>> {
    const tag = new TagEntity({
      name: dto.name,
    });

    const createdTag = await this.tagRepository.create(tag);

    if (!createdTag) {
      throw new Error(TAG_CREATE_ERROR);
    }

    return new BaseResponse<Tag>(TAG_CREATE, createdTag);
  }

  async findAll(): Promise<BaseResponse<Tag[]>> {
    const tags = await this.tagRepository.findAll();

    if (!tags) {
      throw new Error(TAG_FIND_ERROR);
    }
    return new BaseResponse<Tag[]>(TAG_FIND_ALL, tags);
  }

  async findById(id: number): Promise<BaseResponse<Tag>> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new Error(TAG_FIND_ERROR);
    }
    return new BaseResponse<Tag>(TAG_FIND, tag);
  }

  async delete(id: number): Promise<BaseResponse<void>> {
    await this.tagRepository.delete(id);
    return new BaseResponse<void>(TAG_DELETED);
  }

  async update(id: number, dto: UpdateTagDto): Promise<BaseResponse<void>> {
    const tag = new TagEntity({
      name: dto.name,
    });

    const updatedTag = await this.tagRepository.update(id, tag);

    if (!updatedTag) {
      throw new Error(TAG_UPDATE_ERROR);
    }

    return new BaseResponse<void>(TAG_UPDATED);
  }
}
