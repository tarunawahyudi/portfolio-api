import {
  ArticleResponse,
  ArticleStatus,
  ArticleThumbnailResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface ArticleService {
  create(request: CreateArticleRequest): Promise<ArticleResponse>
  modify(id: string, userId: string, data: UpdateArticleRequest): Promise<ArticleResponse>
  fetch(
    userId: string,
    options: PaginationOptions,
    status?: ArticleStatus,
  ): Promise<PaginatedResponse<ArticleResponse>>
  show(id: string, userId: string): Promise<ArticleResponse>
  uploadThumbnail(id: string, userId: string, thumbnailFile: File): Promise<ArticleThumbnailResponse>
  updateStatus(id: string, userId: string, status: ArticleStatus): Promise<ArticleResponse>
  remove(id: string, userId: string): Promise<void>
  restore(id: string, userId: string): Promise<void>
}
