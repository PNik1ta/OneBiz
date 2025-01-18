import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business } from './models/business.model';
import { BusinessRepository } from './repositories/business.repository';

@Module({
  controllers: [BusinessController],
  providers: [BusinessRepository, BusinessService],
  exports: [BusinessRepository, BusinessService],
  imports: [TypeOrmModule.forFeature([Business]), forwardRef(() => UserModule)],
})
export class BusinessModule {}
