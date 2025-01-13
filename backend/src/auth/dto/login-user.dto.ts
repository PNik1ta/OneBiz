import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
    type: String,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password',
    example: 'test',
    type: String,
  })
  password: string;
}
