import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post id',
    example: 0,
  })
  post_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment title',
    example: 'test',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment text',
    example: 'test',
  })
  text: string;
}
