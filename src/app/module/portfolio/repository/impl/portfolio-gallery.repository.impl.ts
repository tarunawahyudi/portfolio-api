import { PortfolioGalleryRepository } from '@module/portfolio/repository/portfolio-gallery.repository'
import { NewPortfolioGallery, PortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'
import { db } from '@db/index'
import { portfolioGallery } from '@db/schema'
import { injectable } from 'tsyringe'

@injectable()
export class PortfolioGalleryRepositoryImpl implements PortfolioGalleryRepository {
  async saveBulk(items: NewPortfolioGallery[]): Promise<PortfolioGallery[]> {
    if (items.length === 0) {
      return []
    }

    return db.insert(portfolioGallery)
      .values(items)
      .returning()
  }
}
