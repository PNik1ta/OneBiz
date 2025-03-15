import { ERoles } from "../enums/roles.enum";

export interface IUser {
  id?: number;
  username: string;
  role: ERoles;
  email: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
  rt?: string;
}
