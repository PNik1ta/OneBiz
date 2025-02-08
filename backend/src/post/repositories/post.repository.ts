import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../models/post.model';
import { Repository, UpdateResult } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { Tag } from '../../tag/models/tag.model';
import { Injectable } from '@nestjs/common';
import { Business } from '../../business/models/business.model';

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
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndMapMany('post.tags', Tag, 'tag', 'tag.id = ANY (post.tagsId)')
      .leftJoinAndMapOne(
        'booking.business',
        Business,
        'business',
        'business.id = post.business_id',
      )
      .select([
        'post.id AS id',
        'post.business_id AS business_id',
        'post.title AS title',
        'post.text AS text',
        'post.background_url AS background_url',
        'post.created_at AS created_at',
        'post.likes AS likes',
      ])
      .addSelect('business.company_name AS company_name')
      .addSelect('business.preview_images_url AS business_preview_images_url')
      .addSelect('tag.name AS tag_name')
      .getRawMany();
  }

  async findByBusinessId(business_id: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndMapMany('post.tags', Tag, 'tag', 'tag.id = ANY (post.tagsId)')
      .select([
        'post.id AS id',
        'post.business_id AS business_id',
        'post.title AS title',
        'post.text AS text',
        'post.background_url AS background_url',
        'post.created_at AS created_at',
        'post.likes AS likes',
      ])
      .addSelect('tag.name AS tag_name')
      .where('post.business_id = :business_id', { business_id })
      .getRawMany();
  }

  async findById(id: number): Promise<Post> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndMapMany('post.tags', Tag, 'tag', 'tag.id = ANY (post.tagsId)')
      .select([
        'post.id AS id',
        'post.business_id AS business_id',
        'post.title AS title',
        'post.text AS text',
        'post.background_url AS background_url',
        'post.created_at AS created_at',
        'post.likes AS likes',
      ])
      .addSelect('tag.name AS tag_name')
      .where('post.id = :id', { id })
      .getRawOne();
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async update(id: number, post: PostEntity): Promise<UpdateResult> {
    return await this.postRepository.update({ id }, post);
  }
}
