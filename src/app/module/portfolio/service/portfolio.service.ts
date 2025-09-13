import {
  CreatePortfolioRequest,
  PortfolioDetailResponse,
  PortfolioGalleryItemResponse,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface PortfolioService {
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<PortfolioResponse>>
  create(data: CreatePortfolioRequest): Promise<PortfolioResponse>
  show(id: string): Promise<PortfolioDetailResponse>
  modify(id: string, userId: string, data: UpdatePortfolioRequest): Promise<PortfolioResponse>
  remove(id: string, userId: string): Promise<void>
  uploadThumbnail(id: string, userId: string, thumbnailFile: File): Promise<{ thumbnailUrl: string | null }>
  uploadGallery(portfolioId: string, files: File[]): Promise<PortfolioGalleryItemResponse[]>
}
