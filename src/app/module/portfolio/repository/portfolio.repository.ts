import {
  NewPortfolio,
  Portfolio,
  PortfolioWithGallery,
  PortfolioWithRelations,
} from '@module/portfolio/entity/portfolio'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewPortfolioView } from '@module/portfolio/entity/portfolio-view'

export interface PortfolioRepository {
  save(data: NewPortfolio): Promise<Portfolio>
  findById(id: string): Promise<Portfolio | null>
  findDetail(id: string): Promise<PortfolioWithRelations | null>
  findOne(id: string, userId: string): Promise<Portfolio | null>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Portfolio>>
  update(id: string, userId: string, data: NewPortfolio): Promise<Portfolio>
  delete(id: string, userId: string): Promise<void>
  updateThumbnail(id: string, userId: string, thumbnailKey: string): Promise<Portfolio>
  logView(data: NewPortfolioView): Promise<void>
}
