import {
  ArticleResponse,
  ArticleThumbnailResponse,
  CreateArticleRequest,
} from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface ArticleService {
  create(request: CreateArticleRequest): Promise<ArticleResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<ArticleResponse>>
  show(id: string): Promise<ArticleResponse>
  uploadThumbnail(id: string, userId: string, thumbnailFile: File): Promise<ArticleThumbnailResponse>
  updateStatus(id: string, userId: string, status: string): Promise<void>
  deleteStatus(id: string, userId: string): Promise<void>
}
