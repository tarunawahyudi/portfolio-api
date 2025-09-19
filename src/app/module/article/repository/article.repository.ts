import { Article, NewArticle } from '@module/article/entity/article'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { ArticleStatus, UpdateArticleRequest } from '@module/article/dto/article.dto'

export interface ArticleRepository {
  save(article: NewArticle): Promise<Article>;
  findAll(
    userId: string,
    options: PaginationOptions,
    status?: ArticleStatus,
  ): Promise<PaginatedResponse<Article>>
  findByIdAndUser(id: string, userId: string): Promise<Article | null>
  update(id: string, userId: string, data: UpdateArticleRequest): Promise<Article>
  updateStatus(id: string, userId: string, status: ArticleStatus): Promise<Article>
  updateThumbnail(id: string, userId: string, thumbnailUrl: string | null): Promise<Article>
}
