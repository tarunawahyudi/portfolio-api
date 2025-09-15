import { EducationController } from '@module/education/controller/education.controller'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import {
  CreateEducationRequest,
  EducationResponse,
  UpdateEducationRequest,
} from '@module/education/dto/education.dto'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { EducationService } from '@module/education/service/education.service'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class EducationControllerImpl implements EducationController {
  constructor(
    @inject('EducationService') private educationService: EducationService,
  ) {}
  async get(ctx: Context): Promise<PageResponse<EducationResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.educationService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.educationService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = (ctx.body as any) as CreateEducationRequest
    request.userId = userId
    const response = await this.educationService.create(request)
    return successResponse(ctx, response, 'Education created success', 201)
  }

  async update(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const { id } = ctx.params
    const data = ctx.body as UpdateEducationRequest

    const updatedEducation = await this.educationService.modify(id, userId, data)
    return successResponse(ctx, updatedEducation, 'Education updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const { id } = ctx.params

    await this.educationService.remove(id, userId)
    return noResponse(ctx, 'Education deleted successfully')
  }
}
