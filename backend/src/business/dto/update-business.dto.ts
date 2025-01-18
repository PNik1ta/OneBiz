import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBusinessDto {
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

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Business backgrounds',
    example: 'test',
  })
  preview_images_url: string[];
}
