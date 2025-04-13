import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERoles } from '../../shared/enums/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User username',
    example: 'test',
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password',
    example: 'test',
    type: String,
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'User avatar url',
    example: 'test',
    type: String,
  })
  avatar_url?: string;

  @IsEnum(ERoles)
  @ApiProperty({
    description: 'User role',
    example: ERoles.ADMIN,
    enum: ERoles,
  })
  role?: ERoles;

  @IsString()
  @ApiProperty({
    description: 'User phone',
    example: '+79311111111',
    type: String,
  })
  phone?: string;
}
