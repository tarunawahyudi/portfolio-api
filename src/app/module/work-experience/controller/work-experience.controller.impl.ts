import { WorkExperienceController } from '@module/work-experience/controller/work-experience.controller'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { WorkExperienceService } from '@module/work-experience/service/work-experience.service'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import {
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest, WorkExperienceResponse,
} from '@module/work-experience/dto/work-experience.dto'

@injectable()
export class WorkExperienceControllerImpl implements WorkExperienceController {
  constructor(
    @inject('WorkExperienceService') private readonly workExperienceService: WorkExperienceService,
  ) {}
  async get(ctx: Context): Promise<PageResponse<WorkExperienceResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.workExperienceService.fetch(options, userId)
    return paginateResponse(ctx, paginatedData)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const request = ctx.body as CreateWorkExperienceRequest
    request.userId = (ctx as any).user?.sub
    const response = await this.workExperienceService.create(request)
    return successResponse(ctx, response, 'work experience saved', 201)
  }

  async put(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdateWorkExperienceRequest

    await this.workExperienceService.modify(id, userId, request)
    return noResponse(ctx, 'Work experience updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub

    await this.workExperienceService.remove(id, userId)
    return noResponse(ctx, 'Work experience deleted successfully')
  }
}
