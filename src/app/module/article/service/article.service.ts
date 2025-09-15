import {
  ArticleResponse,
  ArticleThumbnailResponse,
  CreateArticleRequest,
} from '@module/article/dto/article.dto'
import { PaginationOptions } from '@shared/type/global'
import { Article } from '@module/article/entity/article'

export interface ArticleService {
  create(request: CreateArticleRequest): Promise<ArticleResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Article>>
  show(id: string): Promise<ArticleResponse>
  uploadThumbnail(id: string, userId: string, thumbnailFile: File): Promise<ArticleThumbnailResponse>
  updateStatus(id: string, userId: string, status: string): Promise<void>
}
