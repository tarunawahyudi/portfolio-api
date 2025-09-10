import { InferInsertModel } from 'drizzle-orm'
import { profiles } from '@db/schema'

export type Profile = typeof profiles.$inferSelect & {
  email: string;
};

export type NewProfile = InferInsertModel<typeof profiles>
