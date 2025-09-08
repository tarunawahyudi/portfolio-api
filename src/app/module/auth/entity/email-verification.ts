import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { emailVerification } from '@db/schema'

export type EmailVerification = InferSelectModel<typeof emailVerification>
export type NewEmailVerification = InferInsertModel<typeof emailVerification>
