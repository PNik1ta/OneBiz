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
import { BusinessService } from './business.service';
import { BaseResponse } from '../shared/classes/base-response';
import { Business } from './models/business.model';
import { Roles } from '../shared/decorators/roles.decorator';
import { ERoles } from '../shared/enums/roles.enum';
import { CreateBusinessDto } from './dto/create-business.dto';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { Public } from '../shared/decorators/public.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('business')
@ApiTags('business')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOkResponse({
    description: 'Created business',
    type: BaseResponse<Business>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN, ERoles.BUSINESS)
  async create(
    @Body() dto: CreateBusinessDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<Business>> {
    try {
      return await this.businessService.createBusiness(dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All businesses',
    type: BaseResponse<Business[]>,
  })
  @Get()
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<Business[]>> {
    try {
      return await this.businessService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Business by id',
    type: BaseResponse<Business>,
  })
  @Get(':id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<Business>> {
    try {
      return await this.businessService.findById(id);
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
      return await this.businessService.delete(id);
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
    @Body() dto: UpdateBusinessDto,
    @GetCurrentUserId() userId: number,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.businessService.update(id, dto, userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
