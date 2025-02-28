import { ERoles } from "../../enums/roles.enum"

export interface IRegisterUserDto {
  email: string
  username: string
  password: string
  role?: ERoles
}
