import { SkillController } from '@module/skill/controller/skill.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { SkillService } from '@module/skill/service/skill.service'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { CreateSkillRequest, SkillResponse, UpdateSkillRequest } from '@module/skill/dto/skill.dto'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class SkillControllerImpl implements SkillController {
  constructor(@inject('SkillService') private readonly skillService: SkillService) {}

  async get(ctx: Context): Promise<PaginatedResponse<SkillResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.skillService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const response = await this.skillService.show(id, userId)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')
    const request = ctx.body as any as CreateSkillRequest
    request.userId = userId
    const response = await this.skillService.create(request)
    return successResponse(ctx, response, 'Skill created successfully', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const data = ctx.body as UpdateSkillRequest
    const updated = await this.skillService.modify(id, userId, data)
    return successResponse(ctx, updated, 'Skill updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.skillService.remove(id, userId)
    return noResponse(ctx, 'Skill deleted successfully')
  }
}
