import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { LikeRepository } from './repositories/like.repository';
import { LikeService } from './like.service';
import { Like } from './models/like.model';
import { PostModule } from '../post/post.module';

@Module({
  controllers: [LikeController],
  providers: [LikeRepository, LikeService],
  exports: [LikeRepository, LikeService],
  imports: [TypeOrmModule.forFeature([Like]), PostModule],
})
export class LikeModule {}
