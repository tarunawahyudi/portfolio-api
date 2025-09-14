import { ArticleController } from '@module/article/controller/article.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { ArticleResponse, CreateArticleRequest } from '@module/article/dto/article.dto'
import { inject, injectable } from 'tsyringe'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'
import type { ArticleService } from '@module/article/service/article.service'

@injectable()
export class ArticleControllerImpl implements ArticleController {
  constructor(@inject('ArticleService') private readonly articleService: ArticleService) {}
  async get(ctx: Context): Promise<PaginatedResponse<ArticleResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.articleService.fetch(userId, options)

    return paginateResponse(ctx, paginatedData)
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.articleService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = (ctx.body as any) as CreateArticleRequest
    request.userId = userId
    const response = await this.articleService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

}
