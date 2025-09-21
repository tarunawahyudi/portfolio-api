import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { users } from '@db/schema'
import { db } from '@db/index'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _userWithRelations = db.query.users.findFirst({
  with: {
    profile: true,
    skills: true,
    workExperiences: true,
    educations: true,
    portfolios: true,
    courses: true,
    awards: true,
    articles: true,
  },
})

export type UserWithRelations = NonNullable<Awaited<typeof _userWithRelations>>
