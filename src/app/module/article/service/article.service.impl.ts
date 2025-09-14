import { ArticleService } from '@module/article/service/article.service'
import { ArticleResponse, CreateArticleRequest } from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Article, NewArticle } from '@module/article/entity/article'
import { inject, injectable } from 'tsyringe'
import type { ArticleRepository } from '@module/article/repository/article.repository'
import { toArticleResponse } from '@module/article/mapper/article.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class ArticleServiceImpl implements ArticleService {
  constructor(
    @inject('ArticleRepository') private readonly articleRepository: ArticleRepository
  ) {}
  async create(request: CreateArticleRequest): Promise<ArticleResponse> {
    const response = await this.articleRepository.save(request as NewArticle)
    return toArticleResponse(response)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Article>> {
    const paginatedResult = await this.articleRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toArticleResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination
    }
  }

  async findById(id: string): Promise<ArticleResponse> {
    const row = await this.articleRepository.findById(id)
    if (!row) throw new AppException('ARTICLE-001')
    return toArticleResponse(row)
  }

}
