import { AtGuard } from './../shared/guards/at.guard';
import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { MFile } from '../shared/classes/mFile';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth('JWT-auth')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @ApiOkResponse({
    description: 'File element response',
    type: FileElementResponse,
    isArray: true,
  })
  @ApiConsumes('multipart/form-data') // Указываем тип запроса как multipart/form-data
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary', // Swagger UI отобразит возможность загрузки файла
        },
      },
    },
  })
  @Post('upload')
  @HttpCode(200)
  @UseGuards(AtGuard)
  @UseInterceptors(
    FileInterceptor('files', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiBearerAuth('JWT-auth')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];
    try {
      return await this.filesService.saveFiles(saveArray);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'File element response',
    type: FileElementResponse,
    isArray: true,
  })
  @ApiConsumes('multipart/form-data') // Указываем тип запроса как multipart/form-data
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary', // Swagger UI отобразит возможность загрузки файла
        },
      },
    },
  })
  @Post('upload-multiple')
  @HttpCode(200)
  @UseGuards(AtGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiBearerAuth('JWT-auth')
  async uploadMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [];

    for (const file of files) {
      saveArray.push(new MFile(file));
    }

    try {
      return await this.filesService.saveFiles(saveArray);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
