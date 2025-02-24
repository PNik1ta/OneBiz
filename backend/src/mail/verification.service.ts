import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { generateVerificationCode } from '../shared/utils/generate-code';

@Injectable()
export class VerificationService {
  private verificationCodes = new Map(); // Можно заменить на базу данных

  constructor(private readonly mailerService: MailerService) {}

  // Генерация кода и его отправка на почту
  async sendVerificationCode(email: string) {
    const verificationCode = generateVerificationCode(); // Генерируем уникальный код
    this.verificationCodes.set(email, verificationCode); // Сохраняем код

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    });

    return verificationCode;
  }

  async sendSupportMessage(userEmail: string, message: string) {
    await this.mailerService.sendMail({
      to: process.env.SUPPORT_EMAIL,
      subject: 'Support message',
      text: `Support message from user: ${userEmail}: ${message}`,
    });
  }

  async sendNewPostMessage(
    userEmail: string,
    company: string,
    message: string,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Support message',
      text: `NEW POST FROM COMPANY ${company}: ${message}`,
    });
  }

  // Проверка кода
  validateCode(email: string, code: string): boolean {
    const storedCode = this.verificationCodes.get(email);
    return storedCode === code;
  }

  // Удаление кода после успешной проверки
  deleteCode(email: string) {
    this.verificationCodes.delete(email);
  }
}
