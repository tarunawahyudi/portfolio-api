import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { passwordResets } from '@db/schema'

export type PasswordReset = InferSelectModel<typeof passwordResets>
export type NewPasswordReset = InferInsertModel<typeof passwordResets>
