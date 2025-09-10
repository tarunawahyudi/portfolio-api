import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { workExperiences } from '@db/schema'

export type WorkExperience = InferSelectModel<typeof workExperiences>
export type NewWorkExperience = InferInsertModel<typeof workExperiences>
