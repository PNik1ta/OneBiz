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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../shared/classes/base-response';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ERoles } from '../shared/enums/roles.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { ReviewService } from './review.service';
import { Review } from './models/review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from '../shared/decorators/public.decorator';
import { EReviewType } from '../shared/enums/review-types.enum';

@Controller('review')
@ApiBearerAuth('JWT-auth')
@ApiTags('review')
@UseGuards(RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOkResponse({
    description: 'Created review',
    type: BaseResponse<Review>,
  })
  @Post()
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async create(
    @Body() dto: CreateReviewDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Review>> {
    try {
      return await this.reviewService.createReview(dto, userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All reviews',
    type: BaseResponse<Review[]>,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<Review[]>> {
    try {
      return await this.reviewService.findAll();
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('find-by-user')
  @ApiOkResponse({
    description: 'User reviews',
    type: BaseResponse<Review[]>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async findByUserId(
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Review[]>> {
    try {
      return await this.reviewService.findByUserId(userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Review by id',
    type: BaseResponse<Review>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<Review>> {
    try {
      return await this.reviewService.findById(id);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('find-by-booking-business/:id')
  @ApiOkResponse({
    description: 'Reviews by booking_business_id',
    type: BaseResponse<Review[]>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Public()
  async findByBookingBusinessId(
    @Param('id') id: number,
    @Query('type') type: EReviewType,
  ): Promise<BaseResponse<Review[]>> {
    try {
      return await this.reviewService.findByBookingBusinessId(id, type);
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
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async delete(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.reviewService.delete(id, userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  @ApiOkResponse({
    description: 'Review update message',
    type: BaseResponse<void>,
  })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Roles(ERoles.ADMIN, ERoles.BUSINESS, ERoles.USER)
  async updateInfo(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
    @Body() dto: UpdateReviewDto,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.reviewService.update(id, dto, userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
