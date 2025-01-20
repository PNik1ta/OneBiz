import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Service title',
    example: 'test',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Service description',
    example: 'test',
  })
  description?: string;

  @IsString()
  @ApiProperty({
    description: 'Service background url',
    example: 'test',
  })
  background_url?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Service amount',
    example: 0,
  })
  amount: number;

  @IsNumber()
  @ApiProperty({
    description: 'Service discount',
    example: 0,
  })
  discount?: number;
}
