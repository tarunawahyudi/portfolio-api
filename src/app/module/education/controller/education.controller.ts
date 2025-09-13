import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { EducationResponse } from '@module/education/dto/education.dto'

export interface EducationController {
  get(ctx: Context): Promise<PageResponse<EducationResponse>>
  post(ctx: Context): Promise<AppResponse>
  getById(ctx: Context): Promise<AppResponse>
}
