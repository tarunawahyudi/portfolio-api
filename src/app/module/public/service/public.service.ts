import {
  ContactEmailDto,
  PublicArticleDetailDto,
  PublicPortfolioItemDto,
  PublicProfileResponse,
} from '@module/public/dto/public.dto'
import { PortfolioDetailResponse } from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface PublicService {
  getPublicProfile(username: string): Promise<PublicProfileResponse>
  generateCvAsPdf(username: string): Promise<Buffer>
  getPublicPortfolioDetail(id: string): Promise<PortfolioDetailResponse>
  getPublicArticleBySlug(slug: string): Promise<PublicArticleDetailDto>
  sendContactEmail(request: ContactEmailDto): Promise<void>
  getPublicPortfolios(username: string, options: PaginationOptions): Promise<PaginatedResponse<PublicPortfolioItemDto>>
  getPortfolioCategories(username: string): Promise<string[]>
}
