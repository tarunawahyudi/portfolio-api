import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import { ArticleResponse } from '@module/article/dto/article.dto'

export interface ArticleController {
  get(ctx: Context): Promise<PaginatedResponse<ArticleResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  patch(ctx: Context): Promise<AppResponse>
  postThumbnail(ctx: Context): Promise<AppResponse>
  patchStatus(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
  restore(ctx: Context): Promise<AppResponse>
}
