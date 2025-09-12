import { PortfolioService } from '@module/portfolio/service/portfolio.service'
import { NewPortfolio } from '@module/portfolio/entity/portfolio'
import {
  CreatePortfolioRequest,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import { toPortfolioResponse } from '@module/portfolio/mapper/portfolio.mapper'
import { AppException } from '@core/exception/app.exception'
import { StorageService } from '@core/service/storage.service'
import { generateCdnUrl } from '@shared/util/common.util'

@injectable()
export class PortfolioServiceImpl implements PortfolioService {
  constructor(
    @inject('StorageService') private readonly storageService: StorageService,
    @inject('PortfolioRepository') private readonly portfolioRepository: PortfolioRepository,
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

  async show(id: string): Promise<PortfolioResponse> {
    const portfolio = await this.portfolioRepository.findById(id)
    if (!portfolio) throw new AppException('PORTFOLIO-001')
    return toPortfolioResponse(portfolio)
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

    const { key } = await this.storageService.upload(thumbnailFile, 'thumbnail')
    await this.portfolioRepository.updateThumbnail(id, userId, key)
    return { thumbnailUrl: generateCdnUrl(key) }
  }
}
