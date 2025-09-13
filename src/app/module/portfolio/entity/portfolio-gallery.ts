import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { portfolioGallery } from '@db/schema'

export type PortfolioGallery = InferSelectModel<typeof portfolioGallery>
export type NewPortfolioGallery = InferInsertModel<typeof portfolioGallery>
