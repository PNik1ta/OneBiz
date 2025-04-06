import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../models/post.model';
import { Repository, UpdateResult } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(post: PostEntity): Promise<Post> {
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findByBusinessId(business_id: number): Promise<Post[]> {
    return this.postRepository.findBy({ business_id: business_id });
  }

  async findById(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async update(id: number, post: PostEntity): Promise<UpdateResult> {
    return await this.postRepository.update({ id }, post);
  }
}
