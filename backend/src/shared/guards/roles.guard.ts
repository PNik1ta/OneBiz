import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/models/user.model';
import { ERoles } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<ERoles[]>('roles', context.getHandler());

    if (!roles) {
      return true; // Если роли не указаны, доступ разрешен
    }

    const request = context.switchToHttp().getRequest();

    const user: User = request.user; // Предполагается, что пользователь уже добавлен в запрос

    return roles.includes(user.role);
  }
}
