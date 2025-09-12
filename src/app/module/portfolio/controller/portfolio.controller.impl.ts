import { PortfolioController } from '@module/portfolio/controller/portfolio.controller'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { PortfolioService } from '@module/portfolio/service/portfolio.service'
import {
  noResponse,
  paginateResponse,
  successResponse,
} from '@shared/util/response.util'
import {
  CreatePortfolioRequest,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'

@injectable()
export class PortfolioControllerImpl implements PortfolioController {
  constructor(@inject('PortfolioService') private readonly portfolioService: PortfolioService) {
  }
  async get(ctx: Context): Promise<PageResponse<PortfolioResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.portfolioService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.portfolioService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const { title, description, techStack } = ctx.body as any
    const request: CreatePortfolioRequest = {
      userId: userId,
      title: title,
      description: description,
      techStack: techStack ?? [],
    }

    const response = await this.portfolioService.create(request)
    return successResponse(ctx, response, 'Portfolio saved', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdatePortfolioRequest

    await this.portfolioService.modify(id, userId, request)
    return noResponse(ctx, 'Portfolio updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const userId = (ctx as any).user?.sub

    await this.portfolioService.remove(id, userId)
    return noResponse(ctx, 'Portfolio deleted')
  }
}
