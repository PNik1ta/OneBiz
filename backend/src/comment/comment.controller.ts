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
import { ERoles } from '../shared/enums/roles.enum';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { Public } from '../shared/decorators/public.decorator';
import { CommentService } from './comment.service';
import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@ApiTags('comment')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOkResponse({
    description: 'Created comment',
    type: BaseResponse<Comment>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async create(
    @Body() dto: CreateCommentDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Comment>> {
    try {
      return await this.commentService.create(dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All comments',
    type: BaseResponse<Comment[]>,
  })
  @Get()
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<Comment[]>> {
    try {
      return await this.commentService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Comment by id',
    type: BaseResponse<Comment>,
  })
  @Get('/:id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<Comment>> {
    try {
      return await this.commentService.findById(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Comment by post id',
    type: BaseResponse<Comment[]>,
  })
  @Get('find-by-business-id/:business_id')
  @HttpCode(200)
  @Public()
  async findByPostId(
    @Param('business_id') postId: number,
  ): Promise<BaseResponse<Comment[]>> {
    try {
      return await this.commentService.findByPostId(postId);
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
    @GetCurrentUserId() userId: number,
    @Param('id') id: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.commentService.delete(userId, id);
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
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCommentDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.commentService.update(id, dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
