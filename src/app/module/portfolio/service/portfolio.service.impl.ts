import { PortfolioService } from '@module/portfolio/service/portfolio.service'
import { NewPortfolio } from '@module/portfolio/entity/portfolio'
import {
  CreatePortfolioRequest,
  PortfolioDetailResponse,
  PortfolioGalleryItemResponse,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import {
  toPortfolioDetailResponse,
  toPortfolioGalleryItemResponse,
  toPortfolioResponse,
} from '@module/portfolio/mapper/portfolio.mapper'
import { AppException } from '@core/exception/app.exception'
import { StorageService } from '@core/service/storage.service'
import { cdnUrl } from '@shared/util/common.util'
import { logger } from '@shared/util/logger.util'
import { NewPortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'
import type { PortfolioGalleryRepository } from '@module/portfolio/repository/portfolio-gallery.repository'

@injectable()
export class PortfolioServiceImpl implements PortfolioService {
  constructor(
    @inject('StorageService') private readonly storageService: StorageService,
    @inject('PortfolioRepository') private readonly portfolioRepository: PortfolioRepository,
    @inject('PortfolioGalleryRepository') private readonly portfolioGalleryRepository: PortfolioGalleryRepository,
  ) {}
  async fetch(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<PortfolioResponse>> {
    const paginatedResult = await this.portfolioRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toPortfolioResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination,
    }
  }

  async create(data: CreatePortfolioRequest): Promise<PortfolioResponse> {
    const newPortfolio = await this.portfolioRepository.save(data as NewPortfolio)
    return toPortfolioResponse(newPortfolio)
  }

  async show(id: string): Promise<PortfolioDetailResponse> {
    const portfolio = await this.portfolioRepository.findDetail(id)
    if (!portfolio) throw new AppException('PORTFOLIO-001')
    return toPortfolioDetailResponse(portfolio)
  }

  async modify(
    id: string,
    userId: string,
    data: UpdatePortfolioRequest,
  ): Promise<PortfolioResponse> {
    const updatedPortfolio = await this.portfolioRepository.update(id, userId, data as NewPortfolio)
    return toPortfolioResponse(updatedPortfolio)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.portfolioRepository.delete(id, userId)
  }

  async uploadThumbnail(
    id: string,
    userId: string,
    thumbnailFile: File,
  ): Promise<{ thumbnailUrl: string | null }> {
    const portfolio = await this.portfolioRepository.findOne(id, userId)
    console.log(portfolio)
    if (!portfolio) throw new AppException('COMMON-001')

    const { key } = await this.storageService.upload({
      file: thumbnailFile,
      module: 'portfolio',
      collection: 'thumbnail'
    })
    await this.portfolioRepository.updateThumbnail(id, userId, key)
    return { thumbnailUrl: cdnUrl(key) }
  }

  async uploadGallery(portfolioId: string, files: File[]): Promise<PortfolioGalleryItemResponse[]> {
    const portfolio = await this.portfolioRepository.findById(portfolioId)
    if (!portfolio) throw new AppException('PORTFOLIO-001')

    logger.info(`uploading ${files.length} files in parallel...`)
    const uploadPromises = files.map(file =>
      this.storageService.upload({
        file,
        module: 'portfolio',
        collection: 'gallery'
      })
    )

    const uploadResults = await Promise.all(uploadPromises)
    logger.info('All files uploaded to storage')

    const galleryItemsToSave: NewPortfolioGallery[] = uploadResults.map((result, index) => ({
      portfolioId: portfolioId,
      path: result.key,
      fileType: files[index].type,
      size: files[index].size,
      order: index,
    }))

    const newGalleryItems = await this.portfolioGalleryRepository.saveBulk(galleryItemsToSave)
    logger.info(`${newGalleryItems.length} gallery items saved to database`)

    return newGalleryItems.map(toPortfolioGalleryItemResponse)
  }
}
