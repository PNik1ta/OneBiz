import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Review title',
    example: 'test',
  })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Review rating (1-5)',
    example: 5,
  })
  rating: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Review description',
    example: 'test',
  })
  desciption: string;
}
