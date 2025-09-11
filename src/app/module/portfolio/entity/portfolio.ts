import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { portfolios } from '@db/schema'

export type Portfolio = InferSelectModel<typeof portfolios>
export type NewPortfolio = InferInsertModel<typeof portfolios>
