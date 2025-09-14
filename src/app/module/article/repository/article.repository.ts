import { Article, NewArticle } from '@module/article/entity/article'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface ArticleRepository {
  save(article: NewArticle): Promise<Article>;
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Article>>
  findById(id: string): Promise<Article | null>
}
