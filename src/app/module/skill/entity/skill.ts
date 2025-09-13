import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { skills } from '@db/schema'

export type Skill = InferSelectModel<typeof skills>
export type NewSkill = InferInsertModel<typeof skills>
