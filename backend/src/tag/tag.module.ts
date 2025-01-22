import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagRepository } from './repositories/tag.repository';
import { TagService } from './tag.service';
import { Tag } from './models/tag.model';

@Module({
  controllers: [TagController],
  providers: [TagRepository, TagService],
  exports: [TagRepository, TagService],
  imports: [TypeOrmModule.forFeature([Tag])],
})
export class TagModule {}
