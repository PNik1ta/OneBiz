import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './post.service';
import { Post } from './models/post.model';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [PostController],
  providers: [PostRepository, PostService],
  exports: [PostRepository, PostService],
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => BusinessModule)],
})
export class PostModule {}
