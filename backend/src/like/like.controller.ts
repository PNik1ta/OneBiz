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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../shared/guards/roles.guard';
import { BaseResponse } from '../shared/classes/base-response';
import { Roles } from '../shared/decorators/roles.decorator';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { ERoles } from '../shared/enums/roles.enum';
import { LikeService } from './like.service';
import { Like } from './models/like.model';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('like')
@ApiTags('like')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOkResponse({
    description: 'Created like',
    type: BaseResponse<Like>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async create(
    @Body() dto: CreateLikeDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Like>> {
    try {
      return await this.likeService.create(userId, dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All likes',
    type: BaseResponse<Like[]>,
  })
  @Get()
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async findAll(): Promise<BaseResponse<Like[]>> {
    try {
      return await this.likeService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Like by user id',
    type: BaseResponse<Like[]>,
  })
  @Get('find-by-user-id')
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async findByBusinessId(
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Like[]>> {
    try {
      return await this.likeService.findByUserId(userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Likes by post id',
    type: BaseResponse<Like[]>,
  })
  @Get('find-by-post-id/:post_id')
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async findById(
    @Param('post_id') postId: number,
  ): Promise<BaseResponse<Like[]>> {
    try {
      return await this.likeService.findByPostId(postId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Deleted message',
    type: BaseResponse<void>,
  })
  @Delete(':id')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async delete(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.likeService.delete(userId, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
