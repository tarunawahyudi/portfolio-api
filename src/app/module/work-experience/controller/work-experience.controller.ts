import { Context } from 'elysia'
import { AppResponse } from '@shared/type/global'

export interface WorkExperienceController {
  get(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  put(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
}
