import { injectable, inject } from 'tsyringe'
import { ArticleService } from '@module/article/service/article.service'
import type { ArticleRepository } from '@module/article/repository/article.repository'
import { StorageService } from '@core/service/storage.service'
import {
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleThumbnailResponse,
  ArticleStatus,
} from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewArticle } from '@module/article/entity/article'
import { toArticleResponse } from '@module/article/mapper/article.mapper'
import { AppException } from '@core/exception/app.exception'
import { logger } from '@shared/util/logger.util'

@injectable()
export class ArticleServiceImpl implements ArticleService {
  constructor(
    @inject('ArticleRepository') private readonly articleRepository: ArticleRepository,
    @inject('StorageService') private readonly storageService: StorageService,
  ) {}

  private async findAndValidate(id: string, userId: string) {
    const record = await this.articleRepository.findByIdAndUser(id, userId)
    if (!record) throw new AppException('ARTICLE-001')
    return record
  }

  async fetch(
    userId: string,
    options: PaginationOptions,
    status?: ArticleStatus,
  ): Promise<PaginatedResponse<ArticleResponse>> {
    const result = await this.articleRepository.findAll(userId, options, status)
    return { data: result.data.map(toArticleResponse), pagination: result.pagination }
  }

  async show(id: string, userId: string): Promise<ArticleResponse> {
    const record = await this.findAndValidate(id, userId)
    return toArticleResponse(record)
  }

  async create(request: CreateArticleRequest): Promise<ArticleResponse> {
    const response = await this.articleRepository.save(request as NewArticle)
    return toArticleResponse(response)
  }

  async modify(id: string, userId: string, data: UpdateArticleRequest): Promise<ArticleResponse> {
    await this.findAndValidate(id, userId)
    const updated = await this.articleRepository.update(id, userId, data)
    return toArticleResponse(updated)
  }

  async updateStatus(id: string, userId: string, status: ArticleStatus): Promise<ArticleResponse> {
    await this.findAndValidate(id, userId)
    const updated = await this.articleRepository.updateStatus(id, userId, status)
    return toArticleResponse(updated)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.updateStatus(id, userId, 'deleted')
  }

  async restore(id: string, userId: string): Promise<void> {
    await this.updateStatus(id, userId, 'draft')
  }

  async uploadThumbnail(id: string, userId: string, file: File): Promise<ArticleThumbnailResponse> {
    const article = await this.findAndValidate(id, userId)
    if (article.thumbnail) {
      this.storageService
        .delete(article.thumbnail)
        .catch((err) => logger.error(`Failed to delete old thumbnail: ${err}`))
    }

    const { key } = await this.storageService.upload({
      file,
      module: 'article',
      collection: 'thumbnail',
    })

    const updated = await this.articleRepository.updateThumbnail(id, userId, key)
    return { id: updated.id, thumbnailUrl: toArticleResponse(updated).thumbnail }
  }
}
