import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EReviewType } from '../../shared/enums/review-types.enum';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking or business id',
    example: 0,
  })
  booking_business_id: number;

  @IsEnum(EReviewType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Review type (booking or business)',
    example: EReviewType.BUSINESS,
  })
  type: EReviewType;

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
  description: string;
}
