import { Portfolio, PortfolioWithGallery } from '@module/portfolio/entity/portfolio'
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
    userId: portfolio.userId,
    title: portfolio.title,
    description: portfolio.description ?? undefined,
    thumbnailUrl: cdnUrl(portfolio.thumbnail) ?? '',
    techStack: portfolio.techStack ?? [],
  }
}

export function toPortfolioDetailResponse(portfolio: PortfolioWithGallery): PortfolioDetailResponse {
  return {
    id: portfolio.id,
    userId: portfolio.userId,
    title: portfolio.title,
    description: portfolio.description ?? undefined,
    thumbnailUrl: cdnUrl(portfolio.thumbnail),
    techStack: portfolio.techStack ?? [],
    gallery: portfolio.gallery ? portfolio.gallery.map(toPortfolioGalleryItemResponse) : [],
  }
}

export function toPortfolioGalleryItemResponse(item: PortfolioGallery): PortfolioGalleryItemResponse {
  return {
    id: item.id,
    url: cdnUrl(item.path),
    fileType: item.fileType ?? '',
    size: item.size,
    order: item.order,
  }
}
