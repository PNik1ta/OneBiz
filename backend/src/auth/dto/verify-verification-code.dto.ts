import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyVerificationCodeDto {
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
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'Email code',
    example: '123456',
    type: String,
  })
  code: string;
}
