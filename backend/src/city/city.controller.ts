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
import { Public } from '../shared/decorators/public.decorator';
import { CityService } from './city.service';
import { City } from './models/city.model';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('city')
@ApiTags('city')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOkResponse({
    description: 'Created city',
    type: BaseResponse<City>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN)
  async create(@Body() dto: CreateCityDto): Promise<BaseResponse<City>> {
    try {
      return await this.cityService.createCity(dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All cities',
    type: BaseResponse<City[]>,
  })
  @Get()
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<City[]>> {
    try {
      return await this.cityService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'City by id',
    type: BaseResponse<City>,
  })
  @Get(':id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<City>> {
    try {
      return await this.cityService.findById(id);
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
  @Roles(ERoles.ADMIN)
  async delete(@Param('id') id: number): Promise<BaseResponse<void>> {
    try {
      return await this.cityService.delete(id);
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
  @Roles(ERoles.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCityDto,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.cityService.update(id, dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
