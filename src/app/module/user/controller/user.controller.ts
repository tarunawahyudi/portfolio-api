import {Context} from "elysia"
import { AppResponse } from '@shared/type/global'

export interface UserController {
  getByUsername(ctx: Context): Promise<AppResponse>
  getMe(ctx: Context): Promise<AppResponse>
}
