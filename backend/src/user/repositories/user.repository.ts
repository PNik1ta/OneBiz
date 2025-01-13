import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../models/user.model';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: UserEntity): Promise<User> {
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, user: UserEntity): Promise<UpdateResult> {
    return this.userRepository.update({ id }, user);
  }

  async updateRefreshToken(userId: number, rt: string): Promise<void> {
    await this.userRepository.update(userId, { rt: rt ?? null });
  }
}
