import {Context} from "elysia"

export interface UserController {
  signup(ctx: Context): Promise<any>
}
