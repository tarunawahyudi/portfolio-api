import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { WorkExperienceResponse } from '@module/work-experience/dto/work-experience.dto'

export interface WorkExperienceController {
  get(ctx: Context): Promise<PaginatedResponse<WorkExperienceResponse>>
  post(ctx: Context): Promise<AppResponse>
  put(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
}
