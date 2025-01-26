import { Injectable } from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { Comment } from './models/comment.model';
import { CommentEntity } from './entities/comment.entity';
import {
  COMMENT_CREATE_ERROR,
  COMMENT_FIND_ERROR,
  COMMENT_PERMISSIONS_DELETE_ERROR,
  COMMENT_PERMISSIONS_UPDATE_ERROR,
} from '../shared/errors/comment.errors';
import {
  COMMENT_CREATE,
  COMMENT_DELETED,
  COMMENT_FIND,
  COMMENT_FIND_ALL,
  COMMENT_UPDATED,
} from '../shared/messages/comment.messages';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(
    dto: CreateCommentDto,
    userId: number,
  ): Promise<BaseResponse<Comment>> {
    const comment = new CommentEntity({
      user_id: userId,
      post_id: dto.post_id,
      text: dto.text,
      title: dto.title,
      created_at: new Date(),
      is_edited: false,
    });

    const createdComment = await this.commentRepository.create(comment);

    if (!createdComment) {
      throw new Error(COMMENT_CREATE_ERROR);
    }

    return new BaseResponse<Comment>(COMMENT_CREATE, createdComment);
  }

  async findAll(): Promise<BaseResponse<Comment[]>> {
    const comments = await this.commentRepository.findAll();

    if (!comments) {
      throw new Error(COMMENT_FIND_ERROR);
    }

    return new BaseResponse<Comment[]>(COMMENT_FIND_ALL, comments);
  }

  async findByPostId(postId: number): Promise<BaseResponse<Comment[]>> {
    const comments = await this.commentRepository.findByPostId(postId);

    if (!comments) {
      throw new Error(COMMENT_FIND_ERROR);
    }

    return new BaseResponse<Comment[]>(COMMENT_FIND_ALL, comments);
  }

  async findById(id: number): Promise<BaseResponse<Comment>> {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new Error(COMMENT_FIND_ERROR);
    }

    return new BaseResponse<Comment>(COMMENT_FIND, comment);
  }

  async delete(userId: number, id: number): Promise<BaseResponse<void>> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new Error(COMMENT_FIND_ERROR);
    }

    if (comment.user_id !== userId) {
      throw new Error(COMMENT_PERMISSIONS_DELETE_ERROR);
    }

    await this.commentRepository.delete(id);

    return new BaseResponse<void>(COMMENT_DELETED);
  }

  async update(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new Error(COMMENT_FIND_ERROR);
    }

    if (comment.user_id !== userId) {
      throw new Error(COMMENT_PERMISSIONS_UPDATE_ERROR);
    }

    const entity = new CommentEntity({
      user_id: comment.user_id,
      post_id: comment.post_id,
      title: dto.title,
      text: dto.text,
      created_at: comment.created_at,
      is_edited: true,
    });

    await this.commentRepository.update(id, entity);

    return new BaseResponse<void>(COMMENT_UPDATED);
  }
}
