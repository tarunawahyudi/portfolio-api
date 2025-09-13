import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { educations } from '@db/schema'

export type Education = InferSelectModel<typeof educations>
export type NewEducation = InferInsertModel<typeof educations>
