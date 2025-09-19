import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { AwardResponse } from '@module/award/dto/award.dto'

export interface AwardController {
  get(ctx: Context): Promise<PaginatedResponse<AwardResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  patch(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
  uploadImages(ctx: Context): Promise<AppResponse>
  removeImage(ctx: Context): Promise<AppResponse>
}
