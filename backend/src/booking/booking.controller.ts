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
import { BookingService } from './booking.service';
import { BaseResponse } from '../shared/classes/base-response';
import { Booking } from './models/booking.model';
import { Roles } from '../shared/decorators/roles.decorator';
import { ERoles } from '../shared/enums/roles.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
@ApiTags('booking')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOkResponse({
    description: 'Created booking',
    type: BaseResponse<Booking>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.USER, ERoles.BUSINESS)
  async create(
    @Body() dto: CreateBookingDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Booking>> {
    try {
      return await this.bookingService.createBooking(dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All bookings',
    type: BaseResponse<Booking[]>,
  })
  @Get()
  @HttpCode(200)
  @Roles(ERoles.ADMIN)
  async findAll(): Promise<BaseResponse<Booking[]>> {
    try {
      return await this.bookingService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Booking by user id',
    type: BaseResponse<Booking[]>,
  })
  @Get('find-by-user-id')
  @HttpCode(200)
  @Roles(ERoles.USER, ERoles.BUSINESS, ERoles.ADMIN)
  async findByUserId(
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Booking[]>> {
    try {
      return await this.bookingService.findByUserId(userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Booking by id',
    type: BaseResponse<Booking>,
  })
  @Get(':id')
  @HttpCode(200)
  @Roles(ERoles.USER, ERoles.BUSINESS, ERoles.ADMIN)
  async findById(@Param('id') id: number): Promise<BaseResponse<Booking>> {
    try {
      return await this.bookingService.findById(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Booking by business id',
    type: BaseResponse<Booking[]>,
  })
  @Get('find-by-business/:business_id')
  @HttpCode(200)
  @Roles(ERoles.BUSINESS, ERoles.ADMIN, ERoles.USER)
  async findByBusinessId(
    @Param('business_id') businessId: number,
  ): Promise<BaseResponse<Booking[]>> {
    try {
      return await this.bookingService.findByBusinessId(businessId);
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
  @Roles(ERoles.BUSINESS, ERoles.ADMIN)
  async delete(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.bookingService.delete(id, userId);
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
    @Body() dto: UpdateBookingDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      console.log('User id: ', userId);

      return await this.bookingService.update(id, dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
