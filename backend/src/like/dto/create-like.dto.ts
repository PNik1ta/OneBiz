import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Post id',
    example: 0,
  })
  post_id: number;
}
