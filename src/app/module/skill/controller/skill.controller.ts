import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { SkillResponse } from '@module/skill/dto/skill.dto'

export interface SkillController {
  get(ctx: Context): Promise<PaginatedResponse<SkillResponse>>
  post(ctx: Context): Promise<AppResponse>
  getById(ctx: Context): Promise<AppResponse>
}
