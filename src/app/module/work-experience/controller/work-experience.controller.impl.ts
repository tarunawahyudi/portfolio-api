import { WorkExperienceController } from '@module/work-experience/controller/work-experience.controller'
import { Context } from 'elysia'
import { AppResponse } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { WorkExperienceService } from '@module/work-experience/service/work-experience.service'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { CreateWorkExperienceRequest } from '@module/work-experience/dto/work-experience.dto'

@injectable()
export class WorkExperienceControllerImpl implements WorkExperienceController {
  constructor(
    @inject('WorkExperienceService') private readonly workExperienceService: WorkExperienceService
  ) {}
  async get(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.workExperienceService.fetch(options, userId)
    return paginateResponse(
      ctx,
      paginatedData.data,
      'work experience fetched',
      200,
      paginatedData.pagination
    )
  }

  async post(ctx: Context): Promise<AppResponse> {
    const request = ctx.body as CreateWorkExperienceRequest
    request.userId = (ctx as any).user?.sub
    const response = await this.workExperienceService.create(request)
    return successResponse(ctx, response, 'work experience saved', 201)
  }
}
