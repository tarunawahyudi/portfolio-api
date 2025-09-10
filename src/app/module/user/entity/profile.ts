import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { profiles } from '@db/schema'

export type Profile = InferSelectModel<typeof profiles>
export type NewProfile = InferInsertModel<typeof profiles>

export type ProfileWithEmail = Omit<typeof profiles.$inferSelect, "userId"> & {
  email: string;
};
