import { InferSelectModel } from 'drizzle-orm'
import { roles } from '@db/schema'

export type Role = InferSelectModel<typeof roles>
