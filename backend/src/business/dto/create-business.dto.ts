import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company name',
    example: 'test',
  })
  company_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company description',
    example: 'test',
  })
  company_description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company city id',
    example: 1,
  })
  city_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company place',
    example: 'test',
  })
  place: string;

  @IsArray()
  @ApiProperty({
    description: 'Business backgrounds',
    example: 'test',
  })
  preview_images_url?: string[];
}
