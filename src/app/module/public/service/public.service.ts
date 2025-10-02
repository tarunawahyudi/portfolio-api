import {
  ContactEmailDto,
  PublicArticleDetailDto,
  PublicArticleItemDto,
  PublicPortfolioItemDto,
  PublicProfileResponse,
} from '@module/public/dto/public.dto'
import { PortfolioDetailResponse } from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { CertificateResponse } from '@module/certificate/dto/certificate.dto'

export interface PublicService {
  getPublicProfile(username: string): Promise<PublicProfileResponse>
  generateCvAsPdf(username: string): Promise<Buffer>
  getPublicPortfolioDetail(id: string): Promise<PortfolioDetailResponse>
  getPublicArticleBySlug(slug: string): Promise<PublicArticleDetailDto>
  sendContactEmail(request: ContactEmailDto): Promise<void>
  getPublicPortfolios(username: string, options: PaginationOptions): Promise<PaginatedResponse<PublicPortfolioItemDto>>
  getPortfolioCategories(username: string): Promise<string[]>
  getPublicCertificates(username: string, options: PaginationOptions): Promise<PaginatedResponse<any>>
  getPublicCertificateDetail(id: string): Promise<CertificateResponse>
  getPublicArticles(
    username: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<PublicArticleItemDto>>
}
