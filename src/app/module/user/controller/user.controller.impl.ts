import {inject, injectable} from "tsyringe"
import { Context } from "elysia"
import {User} from "@module/user/entity/user.entity"
import type {UserController} from "@module/user/controller/user.controller"
import type {UserService} from "@module/user/service/user.service"
import { successResponse } from '@shared/util/response.util'

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject("UserService") private readonly userService: UserService) {}

  async create(ctx: Context) {
    const data = ctx.body
    const user = await this.userService.createUser(data as Partial<User>)
    return successResponse(ctx, user, "User created successfully", 201)
  }

  async getByEmail(ctx: Context) {
    const email = ctx.params.email
    const user = await this.userService.getUserByEmail(email)
    return successResponse(ctx, user, "User fetch by email successfully", 200)
  }

  async getAll(ctx: Context) {
    const users = await this.userService.getAll()
    return successResponse(ctx, users, "User fetched successfully", 200)
  }
}
