import { SettingController } from '@module/setting/controller/setting.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { CreateSettingRequest, SettingResponse } from '@module/setting/dto/setting.dto'
import { inject, injectable } from 'tsyringe'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'
import type { SettingService } from '@module/setting/service/setting.service'

@injectable()
export class SettingControllerImpl implements SettingController {
  constructor(
    @inject('SettingService') private settingService: SettingService
  ) {}
  async get(ctx: Context): Promise<PaginatedResponse<SettingResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.settingService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData)
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.settingService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = (ctx.body as any) as CreateSettingRequest
    const response = await this.settingService.create(userId, request)
    return successResponse(ctx, response, 'create success', 201)
  }

}
