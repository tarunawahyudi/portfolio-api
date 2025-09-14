import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { settings } from '@db/schema'

export type Setting = InferSelectModel<typeof settings>
export type NewSetting = InferInsertModel<typeof settings>
