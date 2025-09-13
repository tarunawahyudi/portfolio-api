import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { certificates } from '@db/schema'

export type Certificate = InferSelectModel<typeof certificates>
export type NewCertificate = InferInsertModel<typeof certificates>
