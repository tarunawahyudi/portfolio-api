import {inject, injectable} from "tsyringe"
import { Context } from "elysia"
import {User} from "@module/user/entity/user"
import type {UserController} from "@module/user/controller/user.controller"
import type {UserService} from "@module/user/service/user.service"

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject("UserService") private readonly userService: UserService) {}

  create = async (ctx: Context) => {
    const data = ctx.body
    const user = await this.userService.createUser(data as Partial<User>)
    return { success: true, user }
  }

  getByEmail = async (ctx: Context) => {
    const email = ctx.params.email
    const user = await this.userService.getUserByEmail(email)
    if (!user) return ctx.status(400, { error: "email or password" })
    return user
  }

  getAll = async (ctx: Context) => {
    const users = await this.userService.getAll()
    return ctx.status(200, { users })
  }
}
