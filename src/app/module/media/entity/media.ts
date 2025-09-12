import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { media } from '@db/schema'

export type Media = InferSelectModel<typeof media>
export type NewMedia = InferInsertModel<typeof media>
