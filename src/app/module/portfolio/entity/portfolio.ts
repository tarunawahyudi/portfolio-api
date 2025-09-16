import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { portfolioGallery, portfolios, users } from '@db/schema'
import { PortfolioGallery } from '@module/portfolio/entity/portfolio-gallery'

export type Portfolio = InferSelectModel<typeof portfolios>
export type NewPortfolio = InferInsertModel<typeof portfolios>

export type PortfolioWithGallery = Portfolio & {
  gallery: InferSelectModel<typeof portfolioGallery>[];
};

export type PortfolioWithRelations = Portfolio & {
  gallery: PortfolioGallery[];
  user: InferSelectModel<typeof users>;
  viewCount?: number;
};
