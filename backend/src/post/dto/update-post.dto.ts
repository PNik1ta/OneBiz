import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post business id',
    example: 0,
  })
  business_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post title',
    example: 'test',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post text',
    example: 'test',
  })
  text: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post background url',
    example: 'test',
  })
  background_url: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post tags',
    example: [1, 2, 3],
  })
  tagsId: number[];
}
