import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking datetime',
    example: '2024-01-04',
  })
  datetime: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking business id',
    example: 1,
  })
  business_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking service id',
    example: 1,
  })
  service_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking description',
    example: 'test',
  })
  description: string;
}
