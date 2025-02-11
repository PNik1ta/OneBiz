import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from '../models/like.model';
import { LikeEntity } from '../entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  async create(like: LikeEntity): Promise<Like> {
    return await this.likeRepository.save(like);
  }

  async findAll(): Promise<Like[]> {
    return await this.likeRepository.find();
  }

  async findByUserId(userId: number): Promise<Like[]> {
    return await this.likeRepository.findBy({ user_id: userId });
  }

  async findByPostId(postId: number): Promise<Like[]> {
    return await this.likeRepository.findBy({ post_id: postId });
  }

  async findById(id: number): Promise<Like> {
    return await this.likeRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.likeRepository.delete(id);
  }
}
