import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { portfolioViews } from '@db/schema'

export type PortfolioView = InferSelectModel<typeof portfolioViews>
export type NewPortfolioView = InferInsertModel<typeof portfolioViews>
