import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { loginAttempts } from '@db/schema'

export type LoginAttempt = InferSelectModel<typeof loginAttempts>
export type NewLoginAttempt = InferInsertModel<typeof loginAttempts>
