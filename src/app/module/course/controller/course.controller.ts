import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { CourseResponse } from '@module/course/dto/course.dto'

export interface CourseController {
  get(ctx: Context): Promise<PaginatedResponse<CourseResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  patch(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
}
