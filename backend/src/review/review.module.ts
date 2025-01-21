import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './review.service';
import { Review } from './models/review.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewRepository, ReviewService],
  exports: [ReviewRepository, ReviewService],
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewModule {}
