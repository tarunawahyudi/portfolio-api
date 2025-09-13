import { NewPortfolio, Portfolio, PortfolioWithGallery } from '@module/portfolio/entity/portfolio'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface PortfolioRepository {
  save(data: NewPortfolio): Promise<Portfolio>
  findById(id: string): Promise<Portfolio | null>
  findDetail(id: string): Promise<PortfolioWithGallery | null>
  findOne(id: string, userId: string): Promise<Portfolio | null>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Portfolio>>
  update(id: string, userId: string, data: NewPortfolio): Promise<Portfolio>
  delete(id: string, userId: string): Promise<void>
  updateThumbnail(id: string, userId: string, thumbnailKey: string): Promise<Portfolio>
}
