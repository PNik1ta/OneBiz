import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EBookingStatuses } from '../../shared/enums/booking-statuses.enum';

export class UpdateBookingDto {
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

  @IsEnum(EBookingStatuses)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Booking status',
    example: EBookingStatuses.CREATED,
  })
  status: EBookingStatuses;

  @IsNumber()
  @ApiProperty({
    description: 'Booking amount',
    example: 0,
  })
  amount?: number;
}
