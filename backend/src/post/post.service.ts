import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { BusinessRepository } from '../business/repositories/business.repository';
import { BaseResponse } from '../shared/classes/base-response';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import {
  POST_CREATE_ERROR,
  POST_FIND_ERROR,
  POST_PERMISSIONS_DELETE_ERROR,
  POST_PERMISSIONS_UPDATE_ERROR,
  POST_UPDATE_ERROR,
} from '../shared/errors/post.errors';
import {
  POST_CREATE,
  POST_DELETED,
  POST_FIND,
  POST_FIND_ALL,
  POST_UPDATED,
} from '../shared/messages/post.messages';
import { Post } from './models/post.model';
import { BUSINESS_FIND_ERROR } from '../shared/errors/business.errors';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly businessRepository: BusinessRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<BaseResponse<Post>> {
    const post = new PostEntity({
      business_id: dto.business_id,
      title: dto.title,
      text: dto.text,
      background_url: dto.background_url,
      created_at: new Date(),
      likes: 0,
      tagsId: dto.tagsId,
    });

    const createdPost = await this.postRepository.create(post);

    if (!createdPost) {
      throw new Error(POST_CREATE_ERROR);
    }

    return new BaseResponse<Post>(POST_CREATE, createdPost);
  }

  async findAll(): Promise<BaseResponse<Post[]>> {
    const posts = await this.postRepository.findAll();

    if (!posts) {
      throw new Error(POST_FIND_ERROR);
    }

    return new BaseResponse<Post[]>(POST_FIND_ALL, posts);
  }

  async findByBusinessId(businessId: number): Promise<BaseResponse<Post[]>> {
    const posts = await this.postRepository.findByBusinessId(businessId);

    if (!posts) {
      throw new Error(POST_FIND_ERROR);
    }

    return new BaseResponse<Post[]>(POST_FIND_ALL, posts);
  }

  async findById(id: number): Promise<BaseResponse<Post>> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error(POST_FIND_ERROR);
    }

    return new BaseResponse<Post>(POST_FIND, post);
  }

  async delete(userId: number, id: number): Promise<BaseResponse<void>> {
    const business = await this.businessRepository.findByUserId(userId);

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error(POST_FIND_ERROR);
    }

    if (business.id !== post.business_id) {
      throw new Error(POST_PERMISSIONS_DELETE_ERROR);
    }

    const lastSlashIndex = post.background_url.lastIndexOf('/');
    const secondLastSlashIndex = post.background_url.lastIndexOf(
      '/',
      lastSlashIndex - 1,
    );
    const fileRelativePath = post.background_url.substring(
      secondLastSlashIndex + 1,
    );
    const filePath = `${path.resolve(__dirname, '../../../')}/uploads/${fileRelativePath}`;
    try {
      await unlink(filePath);
    } catch (error) {
      // Handle errors, possibly logging them
      console.error('Error deleting file:', error);
    }

    await this.postRepository.delete(id);
    return new BaseResponse<void>(POST_DELETED);
  }

  async update(
    id: number,
    dto: UpdatePostDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const business = await this.businessRepository.findByUserId(userId);

    if (!business) {
      throw new Error(BUSINESS_FIND_ERROR);
    }

    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error(POST_FIND_ERROR);
    }

    if (business.id !== post.id) {
      throw new Error(POST_PERMISSIONS_UPDATE_ERROR);
    }

    const postEntity = new PostEntity({
      business_id: post.business_id,
      title: dto.title,
      text: dto.text,
      background_url: dto.background_url,
      created_at: post.created_at,
      likes: post.likes,
      tagsId: dto.tagsId,
    });

    const updatedPost = await this.postRepository.update(id, postEntity);

    if (!updatedPost) {
      throw new Error(POST_UPDATE_ERROR);
    }

    return new BaseResponse<void>(POST_UPDATED);
  }
}
