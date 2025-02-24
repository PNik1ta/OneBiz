import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { VerificationService } from '../../mail/verification.service';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(private readonly verificationService: VerificationService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { email, code } = request.body;

    if (!email || !code) {
      throw new BadRequestException('Email and verification code are required');
    }

    const isValid = this.verificationService.validateCode(email, code);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }
    this.verificationService.deleteCode(email);
    return true;
  }
}
