import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../enums/roles.enum';

export const Roles = (...roles: ERoles[]) => {
  return SetMetadata('roles', roles);
};
