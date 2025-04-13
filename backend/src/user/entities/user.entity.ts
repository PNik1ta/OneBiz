import { ERoles } from '../../shared/enums/roles.enum';
import { IUser } from '../../shared/interfaces/user.interface';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  id?: number;
  username: string;
  role: ERoles;
  email: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
  rt?: string;
  phone?: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.email = user.email;
    this.password_hash = user.password_hash;
    this.avatar_url = user.avatar_url;
    this.created_at = user.created_at;
    this.rt = user.rt;
    this.phone = user.phone;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.password_hash = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password_hash);
  }
}
