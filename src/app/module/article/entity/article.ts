import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { articles } from '@db/schema'

export type Article = InferSelectModel<typeof articles>
export type NewArticle = InferInsertModel<typeof articles>
