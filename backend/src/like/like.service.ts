import { Injectable } from '@nestjs/common';
import { LikeRepository } from './repositories/like.repository';
import { CreateLikeDto } from './dto/create-like.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { Like } from './models/like.model';
import { LikeEntity } from './entities/like.entity';
import {
  LIKE_CREATE_ERROR,
  LIKE_FIND_ERROR,
  LIKE_PERMISSIONS_DELETE_ERROR,
} from '../shared/errors/like.errors';
import {
  LIKE_CREATE,
  LIKE_DELETED,
  LIKE_FIND_ALL,
} from '../shared/messages/like.messages';
import { PostRepository } from '../post/repositories/post.repository';
import { POST_FIND_ERROR } from '../shared/errors/post.errors';
import { PostEntity } from '../post/entities/post.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async create(
    userId: number,
    dto: CreateLikeDto,
  ): Promise<BaseResponse<Like>> {
    const like = new LikeEntity({
      user_id: userId,
      post_id: dto.post_id,
    });

    const createdLike = await this.likeRepository.create(like);

    if (!createdLike) {
      throw new Error(LIKE_CREATE_ERROR);
    }

    const post = await this.postRepository.findById(createdLike.post_id);
    if (!post) {
      throw new Error(POST_FIND_ERROR);
    }

    const entity = new PostEntity({
      id: post.id,
      business_id: post.business_id,
      title: post.title,
      text: post.text,
      background_url: post.background_url,
      created_at: post.created_at,
      likes: ++post.likes,
      tagsId: post.tagsId,
    });

    await this.postRepository.update(post.id, entity);

    return new BaseResponse<Like>(LIKE_CREATE, createdLike);
  }

  async findAll(): Promise<BaseResponse<Like[]>> {
    const likes = await this.likeRepository.findAll();

    if (!likes) {
      throw new Error(LIKE_FIND_ERROR);
    }

    return new BaseResponse<Like[]>(LIKE_FIND_ALL, likes);
  }

  async findByUserId(userId: number): Promise<BaseResponse<Like[]>> {
    const likes = await this.likeRepository.findByUserId(userId);

    if (!likes) {
      throw new Error(LIKE_FIND_ERROR);
    }

    return new BaseResponse<Like[]>(LIKE_FIND_ALL, likes);
  }

  async findByPostId(postId: number): Promise<BaseResponse<Like[]>> {
    const likes = await this.likeRepository.findByPostId(postId);

    if (!likes) {
      throw new Error(LIKE_FIND_ERROR);
    }

    return new BaseResponse<Like[]>(LIKE_FIND_ALL, likes);
  }

  async delete(id: number, userId: number): Promise<BaseResponse<void>> {
    const like = await this.likeRepository.findById(id);

    if (!like) {
      throw new Error(LIKE_FIND_ERROR);
    }

    if (like.user_id !== userId) {
      throw new Error(LIKE_PERMISSIONS_DELETE_ERROR);
    }

    await this.likeRepository.delete(id);

    const post = await this.postRepository.findById(like.post_id);
    if (!post) {
      throw new Error(POST_FIND_ERROR);
    }

    const entity = new PostEntity({
      id: post.id,
      business_id: post.business_id,
      title: post.title,
      text: post.text,
      background_url: post.background_url,
      created_at: post.created_at,
      likes: --post.likes,
      tagsId: post.tagsId,
    });

    await this.postRepository.update(post.id, entity);

    return new BaseResponse<void>(LIKE_DELETED);
  }
}
