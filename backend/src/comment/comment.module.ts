import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './comment.service';
import { Comment } from './models/comment.model';

@Module({
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
  exports: [CommentRepository, CommentService],
  imports: [TypeOrmModule.forFeature([Comment])],
})
export class CommentModule {}
