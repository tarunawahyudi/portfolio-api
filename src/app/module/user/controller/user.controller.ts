import {Context} from "elysia"
import { AppResponse } from '@shared/type/global'

export interface UserController {
  signup(ctx: Context): Promise<AppResponse>
}
