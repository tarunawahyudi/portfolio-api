import { PublicArticleDetailDto, PublicProfileResponse } from '@module/public/dto/public.dto'
import { PortfolioDetailResponse } from '@module/portfolio/dto/portfolio.dto'

export interface PublicService {
  getPublicProfile(username: string): Promise<PublicProfileResponse>
  generateCvAsPdf(username: string): Promise<Buffer>
  getPublicPortfolioDetail(id: string): Promise<PortfolioDetailResponse>
  getPublicArticleBySlug(slug: string): Promise<PublicArticleDetailDto>
}
