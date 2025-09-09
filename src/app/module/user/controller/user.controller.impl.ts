import {inject, injectable} from "tsyringe"
import { Context } from "elysia"
import type {UserController} from "@module/user/controller/user.controller"
import type {UserService} from "@module/user/service/user.service"
import { successResponse } from '@shared/util/response.util'
import { AppResponse } from '@shared/type/global'

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject("UserService") private readonly userService: UserService) {}

  async getByUsername(ctx: Context): Promise<AppResponse> {
    const { username } = ctx.params
    console.log(username)
    const response = await this.userService.showByUsername(username)
    return successResponse(ctx, response, "User created successfully", 201)
  }
}
