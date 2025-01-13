import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Tokens } from '../shared/types/token.type';
import { LoginUserDto } from './dto/login-user.dto';
import { GetCurrentUserId } from '../shared/decorators/get-current-user-id.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Register user tokens',
  })
  @Public()
  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<Tokens> {
    try {
      return await this.authService.register(dto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Login user tokens',
  })
  @Public()
  @HttpCode(201)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<Tokens> {
    try {
      return await this.authService.login(loginUserDto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Register user tokens',
  })
  @Post('logout')
  @HttpCode(201)
  async logout(@GetCurrentUserId() userId: number): Promise<void> {
    try {
      return await this.authService.logout(userId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({
    description: 'Refresh user tokens',
  })
  @Public()
  @Post('refresh')
  @HttpCode(201)
  async refreshTokens(@Body() dto: RefreshTokenDto): Promise<Tokens> {
    try {
      return await this.authService.refreshTokens(dto.rt);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
