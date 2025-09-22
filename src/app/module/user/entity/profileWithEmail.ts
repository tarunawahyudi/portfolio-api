import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { profiles } from '@db/schema'

export type ProfileWithEmail = typeof profiles.$inferSelect & {
  email: string;
  username: string;
};

export type Profile = InferSelectModel<typeof profiles>
export type NewProfile = InferInsertModel<typeof profiles>
