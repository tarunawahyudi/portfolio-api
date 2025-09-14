import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { AwardResponse } from '@module/award/dto/award.dto'

export interface AwardController {
  get(ctx: Context): Promise<PaginatedResponse<AwardResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
}
