import { injectable, inject } from 'tsyringe'
import { Context } from 'elysia'
import { CourseController } from '@module/course/controller/course.controller'
import type { CourseService } from '@module/course/service/course.service'
import {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from '@module/course/dto/course.dto'
import { AppResponse, PageResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'

@injectable()
export class CourseControllerImpl implements CourseController {
  constructor(@inject('CourseService') private readonly courseService: CourseService) {}

  async get(ctx: Context): Promise<PageResponse<CourseResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const data = await this.courseService.fetch(userId, options)
    return paginateResponse(ctx, data)
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const data = await this.courseService.show(id, userId)
    return successResponse(ctx, data)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const request = ctx.body as CreateCourseRequest
    request.userId = userId
    const data = await this.courseService.create(request)
    return successResponse(ctx, data, 'Course created successfully', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdateCourseRequest
    const data = await this.courseService.modify(id, userId, request)
    return successResponse(ctx, data, 'Course updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.courseService.remove(id, userId)
    return noResponse(ctx, 'Course deleted successfully')
  }
}
