import { CourseController } from '@module/course/controller/course.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { CourseResponse, CreateCourseRequest } from '@module/course/dto/course.dto'
import { AppException } from '@core/exception/app.exception'
import { inject, injectable } from 'tsyringe'
import type { CourseService } from '@module/course/service/course.service'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { parsePaginationOptions } from '@shared/util/pagination.util'

@injectable()
export class CourseControllerImpl implements CourseController {
  constructor(
    @inject('CourseService') private readonly courseService: CourseService,
  ) {}
  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = (ctx.body as any) as CreateCourseRequest
    request.userId = userId
    const response = await this.courseService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

  async get(ctx: Context): Promise<PaginatedResponse<CourseResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.courseService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData)
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.courseService.show(id)
    return successResponse(ctx, response)
  }

}
