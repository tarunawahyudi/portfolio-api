import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { SettingResponse } from '@module/setting/dto/setting.dto'

export interface SettingController {
  get(ctx: Context): Promise<PaginatedResponse<SettingResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
}
