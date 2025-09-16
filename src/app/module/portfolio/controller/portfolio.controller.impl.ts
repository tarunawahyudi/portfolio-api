import { PortfolioController } from '@module/portfolio/controller/portfolio.controller'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { PortfolioService } from '@module/portfolio/service/portfolio.service'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import {
  CreatePortfolioRequest,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class PortfolioControllerImpl implements PortfolioController {
  constructor(@inject('PortfolioService') private readonly portfolioService: PortfolioService) {}

  async get(ctx: Context): Promise<PageResponse<PortfolioResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.portfolioService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id

    const visitorInfo = {
      ipAddress: ctx.request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: ctx.request.headers.get('user-agent') ?? undefined,
      userId: (ctx as any).user?.sub,
    }

    const response = await this.portfolioService.show(id, visitorInfo)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const request = ctx.body as CreatePortfolioRequest
    request.userId = userId

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

  async uploadThumbnail(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub

    const { id } = ctx.params
    const { thumbnail } = ctx.body as { thumbnail: File }

    if (!thumbnail || thumbnail.size === 0) {
      throw new AppException('MEDIA-001', 'No file uploaded or file is empty.')
    }

    const response = await this.portfolioService.uploadThumbnail(id, userId, thumbnail)
    return successResponse(ctx, response, 'Thumbnail uploaded successfully')
  }

  async uploadGallery(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const { id: portfolioId } = ctx.params

    const { files } = ctx.body as { files: File[] }

    if (!files || files.length === 0) {
      throw new AppException('MEDIA-001', 'No files were uploaded.')
    }

    const response = await this.portfolioService.uploadGallery(portfolioId, files)
    return successResponse(ctx, response, 'Gallery images uploaded successfully')

  }
}
