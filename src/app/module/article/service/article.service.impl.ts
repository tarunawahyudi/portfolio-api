import { ArticleService } from '@module/article/service/article.service'
import {
  ArticleResponse,
  ArticleThumbnailResponse,
  CreateArticleRequest,
} from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewArticle } from '@module/article/entity/article'
import { inject, injectable } from 'tsyringe'
import type { ArticleRepository } from '@module/article/repository/article.repository'
import { toArticleResponse } from '@module/article/mapper/article.mapper'
import { AppException } from '@core/exception/app.exception'
import { StorageService } from '@core/service/storage.service'
import { cdnUrl } from '@shared/util/common.util'

@injectable()
export class ArticleServiceImpl implements ArticleService {
  constructor(
    @inject('ArticleRepository') private readonly articleRepository: ArticleRepository,
    @inject('StorageService') private readonly storageService: StorageService
  ) {}
  async create(request: CreateArticleRequest): Promise<ArticleResponse> {
    const response = await this.articleRepository.save(request as NewArticle)
    return toArticleResponse(response)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<ArticleResponse>> {
    const paginatedResult = await this.articleRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toArticleResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination,
    }
  }

  async show(id: string): Promise<ArticleResponse> {
    const row = await this.articleRepository.findById(id)
    if (!row) throw new AppException('ARTICLE-001')
    return toArticleResponse(row)
  }

  async uploadThumbnail(id: string, userId: string, thumbnailFile: File): Promise<ArticleThumbnailResponse> {
    const article = await this.articleRepository.findById(id)
    if (!article) throw new AppException('ARTICLE-001')

    const { key } = await this.storageService.upload({
      file: thumbnailFile,
      module: 'article',
      collection: 'thumbnail',
    })

    await this.articleRepository.setThumbnailUrl(id, userId, key)
    return {
      id, thumbnailUrl: cdnUrl(key) ?? ''
    }
  }

  async updateStatus(id: string, userId: string, status: string): Promise<void> {
    await this.articleRepository.setStatus(id, userId, status)
  }

  async deleteStatus(id: string, userId: string): Promise<void> {
    await this.articleRepository.softDelete(id, userId)
  }
}
