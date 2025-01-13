import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../shared/types/token.type';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { ERoles } from '../shared/enums/roles.enum';
import {
  USER_ADMIN_CREATE_ERROR,
  USER_INCORRECT_PASSWORD_ERROR,
  USER_INCORRECT_RT_ERROR,
} from '../shared/errors/user.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 30,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await this.hashData(rt);
    await this.userRepository.updateRefreshToken(userId, hash);
  }

  async register(userDto: RegisterUserDto): Promise<Tokens> {
    if (userDto.role === ERoles.ADMIN) {
      throw new Error(USER_ADMIN_CREATE_ERROR);
    }

    const newUser = await this.userService.createUser(userDto);

    const tokens = await this.getTokens(
      newUser.data?.id,
      newUser.data?.email,
      newUser.data?.role,
    );
    await this.updateRtHash(newUser.data?.id, tokens.refresh_token);
    return tokens;
  }

  async login(userDto: LoginUserDto): Promise<Tokens> {
    const user = await this.userService.findUserByEmail(userDto.email);

    const isValid = await new UserEntity(user.data).validatePassword(
      userDto.password,
    );

    if (!isValid) {
      throw new ForbiddenException(USER_INCORRECT_PASSWORD_ERROR);
    }

    const tokens = await this.getTokens(
      user.data?.id,
      user.data?.email,
      user.data?.role,
    );
    await this.updateRtHash(user.data?.id, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(rt: string): Promise<Tokens> {
    const decoded = this.jwtService.decode(rt);
    if (!decoded || !decoded.sub) {
      throw new Error('Invalid refresh token structure');
    }
    const userId = decoded.sub;
    const user = await this.userService.findUserById(userId);

    const rtMatches = await bcrypt.compare(rt, user.data?.rt);
    if (!rtMatches) {
      throw new ForbiddenException(USER_INCORRECT_RT_ERROR);
    }

    const tokens = await this.getTokens(
      user.data?.id,
      user.data?.email,
      user.data?.role,
    );
    await this.updateRtHash(user.data?.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }
}
