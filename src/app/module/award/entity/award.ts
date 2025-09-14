import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { awards } from '@db/schema'

export type Award = InferSelectModel<typeof awards>
export type NewAward = InferInsertModel<typeof awards>
