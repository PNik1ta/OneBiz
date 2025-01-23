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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../shared/guards/roles.guard';
import { BaseResponse } from '../shared/classes/base-response';
import { Roles } from '../shared/decorators/roles.decorator';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { Public } from '../shared/decorators/public.decorator';
import { PostService } from './post.service';
import { Post as PostModel } from './models/post.model';
import { ERoles } from '../shared/enums/roles.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
@ApiTags('post')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({
    description: 'Created post',
    type: BaseResponse<PostModel>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async create(@Body() dto: CreatePostDto): Promise<BaseResponse<PostModel>> {
    try {
      return await this.postService.createPost(dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All posts',
    type: BaseResponse<PostModel[]>,
  })
  @Get()
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<PostModel[]>> {
    try {
      return await this.postService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Post by id',
    type: BaseResponse<PostModel>,
  })
  @Get(':id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<PostModel>> {
    try {
      return await this.postService.findById(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Posts by business_id',
    type: BaseResponse<PostModel[]>,
  })
  @Get('find-by-business-id/:business_id')
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async findByBusinessId(
    @Param('business_id') businessId: number,
  ): Promise<BaseResponse<PostModel[]>> {
    try {
      return await this.postService.findByBusinessId(businessId);
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
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async delete(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.postService.delete(userId, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Updated message',
    type: BaseResponse<void>,
  })
  @Put(':id')
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePostDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.postService.update(id, dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
