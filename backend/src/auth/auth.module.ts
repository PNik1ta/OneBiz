import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../configs/jwt.config';

@Module({
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  imports: [UserModule, JwtModule.registerAsync(getJwtConfig())],
})
export class AuthModule {}
