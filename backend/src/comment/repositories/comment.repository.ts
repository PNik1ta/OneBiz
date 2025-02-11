import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Comment } from '../models/comment.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { User } from '../../user/models/user.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(comment: CommentEntity): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndMapOne(
        'comment.user',
        User,
        'user',
        'user.id = comment.user_id',
      )
      .select([
        'comment.id AS id',
        'comment.post_id AS post_id',
        'comment.title AS title',
        'comment.text AS text',
        'comment.created_at AS created_at',
        'comment.is_edited AS is_edited',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .getRawMany();
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndMapOne(
        'comment.user',
        User,
        'user',
        'user.id = comment.user_id',
      )
      .select([
        'comment.id AS id',
        'comment.post_id AS post_id',
        'comment.title AS title',
        'comment.text AS text',
        'comment.created_at AS created_at',
        'comment.is_edited AS is_edited',
      ])
      .addSelect('user.username AS username')
      .addSelect('user.avatar_url AS user_avatar_url')
      .addSelect('user.id AS user_id')
      .where('comment.post_id = :post_id', { post_id: postId })
      .getRawMany();
  }

  async findById(id: number): Promise<Comment> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndMapOne(
        'comment.user',
        User,
        'user',
        'user.id = comment.user_id',
      )
      .select([
        'comment.id AS id',
        'comment.post_id AS post_id',
        'comment.title AS title',
        'comment.text AS text',
        'comment.created_at AS created_at',
        'comment.is_edited AS is_edited',
      ])
      .where('comment.id = :id', { id })
      .getRawOne();
  }

  async delete(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async update(id: number, comment: CommentEntity): Promise<UpdateResult> {
    return await this.commentRepository.update({ id }, comment);
  }
}
