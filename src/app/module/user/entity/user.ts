import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { users } from '@db/schema'
import { Role } from '@module/user/entity/role'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type UserWithRole = User & { role: Role };
