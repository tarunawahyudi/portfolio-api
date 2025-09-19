import { AwardController } from '@module/award/controller/award.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { AwardResponse, CreateAwardRequest, UpdateAwardRequest } from '@module/award/dto/award.dto'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { AwardService } from '@module/award/service/award.service'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AwardControllerImpl implements AwardController {
  constructor(@inject('AwardService') private readonly awardService: AwardService) {}
  async get(ctx: Context): Promise<PaginatedResponse<AwardResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.awardService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const data = await this.awardService.show(id, userId)
    return successResponse(ctx, data)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = ctx.body as any as CreateAwardRequest
    request.userId = userId
    const response = await this.awardService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdateAwardRequest
    const data = await this.awardService.modify(id, userId, request)
    return successResponse(ctx, data, 'Award updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.awardService.remove(id, userId)
    return noResponse(ctx, 'Award deleted successfully')
  }

  async uploadImages(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { images } = ctx.body as { images: File[] }
    if (!images || images.length === 0) throw new AppException('MEDIA-001')
    const data = await this.awardService.uploadImages(id, userId, images)
    return successResponse(ctx, data, 'Images uploaded successfully')
  }

  async removeImage(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { imageKey } = ctx.body as { imageKey: string }
    const data = await this.awardService.removeImage(id, userId, imageKey)
    return successResponse(ctx, data, 'Image removed successfully')
  }
}
