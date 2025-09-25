import {
  NewPortfolio,
  Portfolio,
  PortfolioWithGallery,
  PortfolioWithRelations,
} from '@module/portfolio/entity/portfolio'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewPortfolioView } from '@module/portfolio/entity/portfolio-view'
import { PortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'

export interface PortfolioRepository {
  save(data: NewPortfolio): Promise<Portfolio>
  findById(id: string, userId: string): Promise<Portfolio | null>
  findDetail(id: string): Promise<PortfolioWithRelations | null>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Portfolio>>
  findGalleryImageById(imageId: string): Promise<PortfolioGallery | undefined>
  update(id: string, userId: string, data: Partial<NewPortfolio>): Promise<Portfolio>
  delete(id: string, userId: string): Promise<void>
  deleteGalleryImage(imageId: string): Promise<void>
  updateThumbnail(id: string, userId: string, thumbnailKey: string): Promise<Portfolio>
  logView(data: NewPortfolioView): Promise<void>
  findByIdWithGallery(id: string, userId: string): Promise<PortfolioWithGallery | undefined>
  findPublicById(id: string): Promise<any | null>
  findAllPublicPortfolios(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Portfolio>>
}
