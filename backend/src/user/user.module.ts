import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
