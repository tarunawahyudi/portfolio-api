import {inject, injectable} from "tsyringe"
import { Context } from "elysia"
import type {UserController} from "@module/user/controller/user.controller"
import type {UserService} from "@module/user/service/user.service"
import { noResponse, successResponse } from '@shared/util/response.util'
import { AppResponse } from '@shared/type/global'
import { AppException } from '@core/exception/app.exception'
import { UpdateProfileRequest } from '@module/user/dto/profile.dto'

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject("UserService") private readonly userService: UserService) {}

  async getByUsername(ctx: Context): Promise<AppResponse> {
    const { username } = ctx.params
    const response = await this.userService.showByUsername(username)
    return successResponse(ctx, response, "User found", 201)
  }

  async putProfile(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = ctx.body as UpdateProfileRequest
    await this.userService.updateProfile(userId, request)
    return noResponse(ctx, 'Profile updated successfully')
  }
}
