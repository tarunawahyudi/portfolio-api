import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { ArticleResponse } from '@module/article/dto/article.dto'

export interface ArticleController {
  get(ctx: Context): Promise<PaginatedResponse<ArticleResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
}
