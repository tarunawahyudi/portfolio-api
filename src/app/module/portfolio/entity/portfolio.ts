import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { portfolioGallery, portfolios } from '@db/schema'

export type Portfolio = InferSelectModel<typeof portfolios>
export type NewPortfolio = InferInsertModel<typeof portfolios>

export type PortfolioWithGallery = Portfolio & {
  gallery: InferSelectModel<typeof portfolioGallery>[];
};
