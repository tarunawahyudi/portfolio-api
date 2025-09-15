import {Context} from "elysia"
import { AppResponse } from '@shared/type/global'

export interface UserController {
  getByUsername(ctx: Context): Promise<AppResponse>
  putProfile(ctx: Context): Promise<AppResponse>
  changePassword(ctx: Context): Promise<AppResponse>
  uploadAvatar(ctx: Context): Promise<AppResponse>
}
