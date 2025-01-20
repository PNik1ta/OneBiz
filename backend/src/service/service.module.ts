import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './repositories/service.repository';
import { ServiceService } from './service.service';
import { Service } from './models/service.model';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [ServiceController],
  providers: [ServiceRepository, ServiceService],
  exports: [ServiceRepository, ServiceService],
  imports: [
    TypeOrmModule.forFeature([Service]),
    forwardRef(() => BusinessModule),
  ],
})
export class ServiceModule {}
