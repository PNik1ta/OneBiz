import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from './city.controller';
import { CityRepository } from './repositories/city.repository';
import { CityService } from './city.service';
import { City } from './models/city.model';

@Module({
  controllers: [CityController],
  providers: [CityRepository, CityService],
  exports: [CityRepository, CityService],
  imports: [TypeOrmModule.forFeature([City])],
})
export class CityModule {}
