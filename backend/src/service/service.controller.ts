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
import { ServiceService } from './service.service';
import { Service } from './models/service.model';
import { CreateServiceDto } from './dto/create-service';
import { UpdateServiceDto } from './dto/update-service';

@Controller('service')
@ApiTags('service')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ApiOkResponse({
    description: 'Created service',
    type: BaseResponse<Service>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async create(
    @Body() dto: CreateServiceDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Service>> {
    try {
      return await this.serviceService.createService(dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All services',
    type: BaseResponse<Service[]>,
  })
  @Get()
  @HttpCode(200)
  @Roles(ERoles.ADMIN)
  async findAll(): Promise<BaseResponse<Service[]>> {
    try {
      return await this.serviceService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Service by id',
    type: BaseResponse<Service>,
  })
  @Get(':id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<Service>> {
    try {
      return await this.serviceService.findById(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All services by business id',
    type: BaseResponse<Service[]>,
  })
  @Get('find-by-business/:businessId')
  @HttpCode(200)
  @Public()
  async findByBusinessId(
    @Param('businessId') businessId: number,
  ): Promise<BaseResponse<Service[]>> {
    try {
      return await this.serviceService.findByBusinessId(businessId);
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
  async delete(@Param('id') id: number): Promise<BaseResponse<void>> {
    try {
      return await this.serviceService.delete(id);
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
    @Body() dto: UpdateServiceDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.serviceService.update(id, dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
