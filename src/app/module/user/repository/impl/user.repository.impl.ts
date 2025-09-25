import { NewUser, User, UserWithRelations } from '@module/user/entity/user'
import { injectable } from 'tsyringe'
import type { UserRepository } from '@module/user/repository/user.repository'
import { db } from '@db/index'
import { articles, portfolios, users } from '@db/schema'
import { and, eq } from 'drizzle-orm'
import { getDbOrTx } from '@shared/decorator/transactional.decorator'

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async save(data: NewUser): Promise<User> {
    const dbOrTx = getDbOrTx()
    const [inserted] = await dbOrTx.insert(users).values(data).returning()

    return inserted
  }

  async markVerified(userId: string): Promise<void> {
    const dbOrTx = getDbOrTx()
    await dbOrTx
      .update(users)
      .set({
        isVerified: true,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.username, username),
    })

    return row ?? null
  }

  async findById(id: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    return row ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    return row ?? null
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId))
  }

  async findPublicProfileByUsername(username: string): Promise<UserWithRelations | null> {
    const user = await db.query.users.findFirst({
      where: and(eq(users.username, username), eq(users.status, 'active')),
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
            id: true,
            title: true,
            category: true,
            thumbnail: true,
            summary: true,
            repoUrl: true,
            projectUrl: true,
            techStack: true,
          },
          where: and(
            eq(portfolios.visibility, 'public'),
            eq(portfolios.status, 'published'),
            eq(portfolios.isFeatured, true)
          ),
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        },

        certificates: {
          columns: {
            id: true,
            title: true,
            organization: true,
            display: true,
            issueDate: true,
            credentialId: true,
            credentialUrl: true,
            certificateImage: true,
          },
          orderBy: (cert, { desc }) => [desc(cert.issueDate)],
          limit: 6,
        },
      },
    })
    return user ?? null
  }
}
