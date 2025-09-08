import {inject, injectable} from "tsyringe"
import { Context } from "elysia"
import type {UserController} from "@module/user/controller/user.controller"
import type {UserService} from "@module/user/service/user.service"
import { successResponse } from '@shared/util/response.util'
import { CreateUserRequest } from '@module/user/dto/user.dto'
import { AppResponse } from '@shared/type/global'

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject("UserService") private readonly userService: UserService) {}

  async signup(ctx: Context): Promise<AppResponse> {
    const data = ctx.body as CreateUserRequest
    const user = await this.userService.create(data)
    return successResponse(ctx, user, "User created successfully", 201)
  }
}
