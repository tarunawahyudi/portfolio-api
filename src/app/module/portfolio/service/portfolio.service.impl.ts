import { PortfolioService } from '@module/portfolio/service/portfolio.service'
import { NewPortfolio } from '@module/portfolio/entity/portfolio'
import {
  CreatePortfolioRequest,
  PortfolioDetailResponse,
  PortfolioGalleryItemResponse,
  PortfolioResponse,
  UpdatePortfolioRequest,
  VisitorInfo,
} from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import geoip from 'geoip-lite'
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
    @inject('PortfolioGalleryRepository')
    private readonly portfolioGalleryRepository: PortfolioGalleryRepository,
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

  async show(id: string, visitorInfo: VisitorInfo): Promise<PortfolioDetailResponse> {
    const portfolio = await this.portfolioRepository.findDetail(id)
    if (!portfolio) throw new AppException('PORTFOLIO-001')

    if (visitorInfo.ipAddress) {
      this.logVisitor(id, visitorInfo).catch((err) => {
        console.error(err)
        logger.error('Failed to log portfolio view')
      })
    }

    return toPortfolioDetailResponse(portfolio)
  }

  async modify(
    id: string,
    userId: string,
    data: UpdatePortfolioRequest,
  ): Promise<PortfolioResponse> {
    const existingPortfolio = await this.portfolioRepository.findById(id, userId)
    if (!existingPortfolio) {
      throw new AppException('PORTFOLIO-001')
    }

    const updatedPortfolio = await this.portfolioRepository.update(id, userId, data)
    return toPortfolioResponse(updatedPortfolio)
  }

  async remove(id: string, userId: string): Promise<void> {
    logger.info(`Attempting to delete portfolio ID: ${id} for user ID: ${userId}`)

    const portfolioToDelete = await this.portfolioRepository.findByIdWithGallery(id, userId)

    if (!portfolioToDelete) {
      logger.warn(`Portfolio not found or user not authorized. ID: ${id}`)
      throw new AppException('PORTFOLIO-001')
    }

    const keysToDelete: string[] = []

    if (portfolioToDelete.thumbnail) {
      keysToDelete.push(portfolioToDelete.thumbnail)
    }

    if (portfolioToDelete.gallery && portfolioToDelete.gallery.length > 0) {
      const galleryKeys = portfolioToDelete.gallery
        .map((item) => item.path)
        .filter((path): path is string => !!path)
      keysToDelete.push(...galleryKeys)
    }

    if (keysToDelete.length > 0) {
      logger.info(
        `Deleting ${keysToDelete.length} associated files from R2 for portfolio ID: ${id}`,
      )
      await this.storageService.deleteMany(keysToDelete)
      logger.info(`Files deleted successfully from R2.`)
    } else {
      logger.info(`No associated files to delete for portfolio ID: ${id}`)
    }

    await this.portfolioRepository.delete(id, userId)
    logger.info(`Portfolio record deleted successfully from database. ID: ${id}`)
  }

  async uploadThumbnail(
    portfolioId: string,
    userId: string,
    file: File,
  ): Promise<{ thumbnailUrl: string | null }> {
    const portfolio = await this.portfolioRepository.findById(portfolioId, userId)
    if (!portfolio) {
      throw new AppException('PORTFOLIO-001')
    }

    const oldThumbnailKey = portfolio.thumbnail
    const { key: newThumbnailKey } = await this.storageService.upload({
      file,
      module: 'portfolio',
      collection: 'thumbnail',
    })

    await this.portfolioRepository.update(portfolioId, userId, { thumbnail: newThumbnailKey })
    if (oldThumbnailKey) {
      logger.info(`[PortfolioService] Deleting old thumbnail: ${oldThumbnailKey}`)
      await this.storageService.delete(oldThumbnailKey)
    }

    return { thumbnailUrl: cdnUrl(newThumbnailKey) }
  }

  async removeGalleryImage(portfolioId: string, imageId: string, userId: string): Promise<void> {
    const image = await this.portfolioRepository.findGalleryImageById(imageId)

    if (!image || image.portfolioId !== portfolioId) {
      throw new AppException('GALLERY-001')
    }
    const portfolio = await this.portfolioRepository.findById(portfolioId, userId)
    if (!portfolio) {
      throw new AppException('PORTFOLIO-001')
    }

    if (image.path) {
      await this.storageService.delete(image.path)
    }

    await this.portfolioRepository.deleteGalleryImage(imageId)
  }

  async uploadGallery(portfolioId: string, userId: string, files: File[]): Promise<PortfolioGalleryItemResponse[]> {
    const portfolio = await this.portfolioRepository.findById(portfolioId, userId)
    if (!portfolio) throw new AppException('PORTFOLIO-001')

    logger.info(`uploading ${files.length} files in parallel...`)
    const uploadPromises = files.map((file) =>
      this.storageService.upload({
        file,
        module: 'portfolio',
        collection: 'gallery',
      }),
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

  private async logVisitor(portfolioId: string, visitorInfo: VisitorInfo): Promise<void> {
    const geo = geoip.lookup(visitorInfo.ipAddress!)

    await this.portfolioRepository.logView({
      portfolioId: portfolioId,
      userId: visitorInfo.userId,
      ipAddress: visitorInfo.ipAddress,
      userAgent: visitorInfo.userAgent,
      country: geo?.country,
      region: geo?.region,
      city: geo?.city,
      latitude: geo?.ll[0],
      longitude: geo?.ll[1],
    })

    logger.info(`View logged for portfolio ${portfolioId} from IP ${visitorInfo.ipAddress}`)
  }
}
