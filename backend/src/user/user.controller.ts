import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ERoles } from '../shared/enums/roles.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { Public } from '../shared/decorators/public.decorator';

@Controller('user')
@ApiBearerAuth('JWT-auth')
@ApiTags('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Created user',
    type: BaseResponse<User>,
  })
  @Post()
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @Public()
  async create(@Body() dto: CreateUserDto): Promise<BaseResponse<User>> {
    try {
      return await this.userService.createUser(dto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All users',
    type: BaseResponse<User[]>,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Roles(ERoles.ADMIN)
  async findAll(): Promise<BaseResponse<User[]>> {
    try {
      return await this.userService.findAll();
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get-profile')
  @ApiOkResponse({
    description: 'User by id',
    type: BaseResponse<User>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  async getProfile(
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<User>> {
    try {
      return await this.userService.findUserById(userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'User by email',
    type: BaseResponse<User>,
  })
  @Get('find-by-email/:email')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  async findByEmail(
    @Param('email') email: string,
  ): Promise<BaseResponse<User>> {
    try {
      return await this.userService.findUserByEmail(email);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'User by id',
    type: BaseResponse<User>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Roles(ERoles.ADMIN)
  async findById(@Param('id') id: number): Promise<BaseResponse<User>> {
    try {
      return await this.userService.findUserById(id);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Deleted message',
    type: BaseResponse<void>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Roles(ERoles.ADMIN)
  async delete(@Param('id') id: number): Promise<BaseResponse<void>> {
    try {
      return await this.userService.deleteUser(id);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('update-info')
  @ApiOkResponse({
    description: 'User update message',
    type: BaseResponse<void>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  async updateInfo(
    @GetCurrentUserId() userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.userService.update(userId, dto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
