import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User username',
    example: 'test',
    type: String,
  })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User avatar url',
    example: 'test',
    type: String,
  })
  avatar_url?: string;
}
