import { injectable, inject } from 'tsyringe'
import { Context } from 'elysia'
import { ArticleController } from '@module/article/controller/article.controller'
import type { ArticleService } from '@module/article/service/article.service'
import {
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleStatus,
} from '@module/article/dto/article.dto'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class ArticleControllerImpl implements ArticleController {
  constructor(@inject('ArticleService') private readonly articleService: ArticleService) {}

  async get(ctx: Context): Promise<PaginatedResponse<ArticleResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const statusQuery = ctx.query.status
    const validStatuses: ArticleStatus[] = ['draft', 'published', 'deleted']
    const status = validStatuses.includes(statusQuery as ArticleStatus)
      ? (statusQuery as ArticleStatus)
      : undefined

    const data = await this.articleService.fetch(userId, options, status)
    return paginateResponse(ctx, data)
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const data = await this.articleService.show(id, userId)
    return successResponse(ctx, data)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const request = ctx.body as CreateArticleRequest
    request.userId = userId
    const data = await this.articleService.create(request)
    return successResponse(ctx, data, 'Article created successfully', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdateArticleRequest
    const data = await this.articleService.modify(id, userId, request)
    return successResponse(ctx, data, 'Article updated successfully')
  }

  async postThumbnail(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { thumbnail } = ctx.body as { thumbnail: File }
    if (!thumbnail) throw new AppException('MEDIA-001')
    const data = await this.articleService.uploadThumbnail(id, userId, thumbnail)
    return successResponse(ctx, data, 'Thumbnail uploaded successfully')
  }

  async patchStatus(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { status } = ctx.body as { status: ArticleStatus }
    const data = await this.articleService.updateStatus(id, userId, status)
    return successResponse(ctx, data, `Article status updated to ${status}`)
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.articleService.remove(id, userId)
    return noResponse(ctx, 'Article moved to trash')
  }

  async restore(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.articleService.restore(id, userId)
    return noResponse(ctx, 'Article restored successfully')
  }
}
