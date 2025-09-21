import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { users, articles, portfolios } from '@db/schema'
import { db } from '@db/index'
import { eq } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _userWithRelations = db.query.users.findFirst({
  with: {
    profile: true,
    skills: true,
    workExperiences: { orderBy: (exp, { desc }) => [desc(exp.startDate)] },
    educations: { orderBy: (edu, { desc }) => [desc(edu.startDate)] },
    courses: { orderBy: (crs, { desc }) => [desc(crs.startDate)] },
    awards: { orderBy: (awd, { desc }) => [desc(awd.createdAt)] },
    articles: {
      columns: {
        title: true,
        thumbnail: true,
        tags: true,
        slug: true,
      },
      where: eq(articles.status, 'published'),
      orderBy: (art, { desc }) => [desc(art.publishedAt)],
      limit: 6,
    },
    portfolios: {
      columns: {
        title: true,
        category: true,
        thumbnail: true,
        summary: true,
        repoUrl: true,
        projectUrl: true,
      },
      where: eq(portfolios.status, 'published'),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
      limit: 6,
    },
    certificates: {
      columns: {
        id: true,
        title: true,
        organization: true,
        display: true,
      },
      orderBy: (cert, { desc }) => [desc(cert.issueDate)],
      limit: 6,
    },
  },
})

export type UserWithRelations = NonNullable<Awaited<typeof _userWithRelations>>
