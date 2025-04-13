import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'City name',
    example: 'test',
  })
  name: string;
}
