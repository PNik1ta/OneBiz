import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tag name',
    example: 'test',
  })
  name: string;
}
