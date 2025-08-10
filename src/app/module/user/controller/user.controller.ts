import {Context} from "elysia"

export interface UserController {
  create(ctx: Context): Promise<any>
  getByEmail(ctx: Context): Promise<any>
  getAll(ctx: Context): Promise<any>
}
