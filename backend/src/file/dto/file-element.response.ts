import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileElementResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'File url',
    example: 'test',
  })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'File name',
    example: 'test',
  })
  name: string;
}
