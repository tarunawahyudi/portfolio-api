import { Portfolio, PortfolioWithRelations } from '@module/portfolio/entity/portfolio'
import {
  PortfolioDetailResponse,
  PortfolioGalleryItemResponse,
  PortfolioResponse,
} from '@module/portfolio/dto/portfolio.dto'
import { cdnUrl } from '@shared/util/common.util'
import { PortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'

export function toPortfolioResponse(portfolio: Portfolio): PortfolioResponse {
  return {
    id: portfolio.id,
    title: portfolio.title,
    category: portfolio.category,
    summary: portfolio.summary ?? undefined,
    thumbnailUrl: cdnUrl(portfolio.thumbnail),
    status: portfolio.status,
    isFeatured: portfolio.isFeatured ?? false,
  }
}

export function toPortfolioDetailResponse(portfolio: PortfolioWithRelations): PortfolioDetailResponse {
  return {
    id: portfolio.id,
    title: portfolio.title,
    category: portfolio.category,
    summary: portfolio.summary ?? undefined,
    thumbnailUrl: cdnUrl(portfolio.thumbnail),
    status: portfolio.status,
    isFeatured: portfolio.isFeatured ?? false,
    userId: portfolio.userId,
    description: portfolio.description ?? undefined,
    projectUrl: portfolio.projectUrl ?? undefined,
    repoUrl: portfolio.repoUrl ?? undefined,
    demoUrl: portfolio.demoUrl ?? undefined,
    techStack: portfolio.techStack ?? [],
    publishedAt: portfolio.publishedAt,
    viewCount: portfolio.viewCount ?? 0,
    gallery: portfolio.gallery ? portfolio.gallery.map(toPortfolioGalleryItemResponse) : [],
  }
}

export function toPortfolioGalleryItemResponse(item: PortfolioGallery): PortfolioGalleryItemResponse {
  return {
    id: item.id,
    url: cdnUrl(item.path),
    order: item.order,
  }
}
