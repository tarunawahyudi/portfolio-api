import { AwardController } from '@module/award/controller/award.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { AwardResponse, CreateAwardRequest } from '@module/award/dto/award.dto'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { AwardService } from '@module/award/service/award.service'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AwardControllerImpl implements AwardController {
  constructor(
    @inject('AwardService') private readonly awardService: AwardService,
  ) {}
  async get(ctx: Context): Promise<PaginatedResponse<AwardResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.awardService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.awardService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = (ctx.body as any) as CreateAwardRequest
    request.userId = userId
    const response = await this.awardService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

}
