import { Portfolio } from '@module/portfolio/entity/portfolio'
import { PortfolioResponse } from '@module/portfolio/dto/portfolio.dto'
import { generateCdnUrl } from '@shared/util/common.util'

export function toPortfolioResponse(portfolio: Portfolio): PortfolioResponse {
  return {
    id: portfolio.id,
    userId: portfolio.userId,
    title: portfolio.title,
    description: portfolio.description ?? undefined,
    thumbnailUrl: generateCdnUrl(portfolio.thumbnail) ?? '',
    techStack: portfolio.techStack ?? [],
  }
}
