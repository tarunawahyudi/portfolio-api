import { Portfolio } from '@module/portfolio/entity/portfolio'
import { PublicPortfolioItemDto } from '@module/public/dto/public.dto'
import { cdnUrl } from '@shared/util/common.util'

export function toPublicPortfolioItem(portfolio: Portfolio): PublicPortfolioItemDto {
  return {
    id: portfolio.id,
    title: portfolio.title,
    category: portfolio.category,
    thumbnail: cdnUrl(portfolio.thumbnail),
    summary: portfolio.summary ?? null,
    repoUrl: portfolio.repoUrl ?? null,
    projectUrl: portfolio.projectUrl ?? null,
    techStack: portfolio.techStack ?? [],
  };
}
