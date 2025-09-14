import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { courses } from '@db/schema'

export type Course = InferSelectModel<typeof courses>
export type NewCourse = InferInsertModel<typeof courses>
