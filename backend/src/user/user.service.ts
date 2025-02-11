import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { User } from './models/user.model';
import { UserEntity } from './entities/user.entity';
import { ERoles } from '../shared/enums/roles.enum';
import {
  USER_CREATE_ERROR,
  USER_FIND_ERROR,
  USER_UPDATE_ERROR,
} from '../shared/errors/user.errors';
import {
  USER_CREATE,
  USER_DELETED,
  USER_FIND,
  USER_FIND_ALL,
  USER_UPDATED,
} from '../shared/messages/user.messages';
import { unlink } from 'fs/promises';
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<BaseResponse<User>> {
    const user = await new UserEntity({
      email: dto.email,
      username: dto.username,
      role: dto.role ?? ERoles.USER,
      password_hash: '',
      avatar_url: dto.avatar_url ?? null,
      created_at: new Date(),
    }).setPassword(dto.password);

    const createdUser = await this.userRepository.create(user);

    if (!createdUser) {
      throw new Error(USER_CREATE_ERROR);
    }

    return new BaseResponse<User>(USER_CREATE, createdUser);
  }

  async findAll(): Promise<BaseResponse<User[]>> {
    const users = await this.userRepository.findAll();

    if (!users?.length) {
      throw new Error(USER_FIND_ERROR);
    }

    return new BaseResponse<User[]>(USER_FIND_ALL, users);
  }

  async findUserByEmail(email: string): Promise<BaseResponse<User>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(USER_FIND_ERROR);
    }

    return new BaseResponse<User>(USER_FIND, user);
  }

  async findUserById(id: number): Promise<BaseResponse<User>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(USER_FIND_ERROR);
    }

    return new BaseResponse<User>(USER_FIND, user);
  }

  async deleteUser(id: number): Promise<BaseResponse<void>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(USER_FIND_ERROR);
    }

    const lastSlashIndex = user.avatar_url.lastIndexOf('/');
    const secondLastSlashIndex = user.avatar_url.lastIndexOf(
      '/',
      lastSlashIndex - 1,
    );

    // Extract the relative file path starting from the second last slash
    const fileRelativePath = user.avatar_url.substring(
      secondLastSlashIndex + 1,
    );

    // Combine the relative path with the base upload path
    const filePath = `${path.resolve(__dirname, '../../../')}/uploads/${fileRelativePath}`;

    try {
      await this.userRepository.delete(id);
      // Delete the file from the server
      await unlink(filePath);

      // Delete the company record from the database

      return new BaseResponse<void>(USER_DELETED);
    } catch (error) {
      // Handle errors, possibly logging them
      console.error('Error deleting file:', error);
    }
  }

  async update(
    user_id: number,
    dto: UpdateUserDto,
  ): Promise<BaseResponse<void>> {
    const updatedUser = await this.userRepository.findById(user_id);

    if (!updatedUser) {
      throw new Error(USER_FIND_ERROR);
    }

    const entity = await new UserEntity({
      email: updatedUser.email,
      username: dto.username ?? updatedUser.username,
      role: updatedUser.role,
      password_hash: updatedUser.password_hash,
      avatar_url: dto.avatar_url ?? updatedUser.avatar_url,
      created_at: updatedUser.created_at,
    });

    const res = await this.userRepository.update(user_id, entity);
    if (!res) {
      throw new Error(USER_UPDATE_ERROR);
    }
    return new BaseResponse<void>(USER_UPDATED);
  }
}
