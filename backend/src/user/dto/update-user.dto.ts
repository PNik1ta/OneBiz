import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({
    description: 'User username',
    example: 'test',
    type: String,
  })
  username?: string;

  @IsString()
  @ApiProperty({
    description: 'User avatar url',
    example: 'test',
    type: String,
  })
  avatar_url?: string;

  @IsString()
  @ApiProperty({
    description: 'User phone',
    example: '+79311111111',
    type: String,
  })
  phone?: string;
}
