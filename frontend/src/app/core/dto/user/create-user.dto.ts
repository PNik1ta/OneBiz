import { ERoles } from "../../enums/roles.enum";

export interface ICreateUserDto {
  email: string;
  username: string;
  password: string;
  avatar_url?: string;
  role?: ERoles;
}
