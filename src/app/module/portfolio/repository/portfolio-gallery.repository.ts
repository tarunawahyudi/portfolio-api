import { NewPortfolioGallery, PortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'

export interface PortfolioGalleryRepository {
  saveBulk(items: NewPortfolioGallery[]): Promise<PortfolioGallery[]>
}
