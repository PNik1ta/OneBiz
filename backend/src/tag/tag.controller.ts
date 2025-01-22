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
import { TagService } from './tag.service';
import { Tag } from './models/tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
@ApiTags('tag')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({
    description: 'Created tag',
    type: BaseResponse<Tag>,
  })
  @Post()
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @Roles(ERoles.ADMIN)
  async create(@Body() dto: CreateTagDto): Promise<BaseResponse<Tag>> {
    try {
      return await this.tagService.createTag(dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'All tags',
    type: BaseResponse<Tag[]>,
  })
  @Get()
  @HttpCode(200)
  @Public()
  async findAll(): Promise<BaseResponse<Tag[]>> {
    try {
      return await this.tagService.findAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Tag by id',
    type: BaseResponse<Tag>,
  })
  @Get(':id')
  @HttpCode(200)
  @Public()
  async findById(@Param('id') id: number): Promise<BaseResponse<Tag>> {
    try {
      return await this.tagService.findById(id);
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
      return await this.tagService.delete(id);
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
    @Body() dto: UpdateTagDto,
  ): Promise<BaseResponse<void>> {
    try {
      return await this.tagService.update(id, dto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
