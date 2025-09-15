import { ArticleRepository } from '@module/article/repository/article.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Article, NewArticle } from '@module/article/entity/article'
import { and, eq } from 'drizzle-orm'
import { articles } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { injectable } from 'tsyringe'

@injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Article>> {
    const whereCondition = eq(articles.userId, userId)
    return paginate(db, articles, options, [], whereCondition)
  }

  async findById(id: string): Promise<Article | null> {
    const row = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    })

    return row ?? null
  }

  async save(data: NewArticle): Promise<Article> {
    const [inserted] = await db.insert(articles).values(data).returning()

    return inserted
  }

  async setThumbnailUrl(id: string, userId: string, thumbnailKey: string): Promise<Article> {
    const [updatedArticle] = await db
      .update(articles)
      .set({ thumbnail: thumbnailKey, updatedAt: new Date() })
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()

    return updatedArticle
  }

  async setStatus(id: string, userId: string, status: string): Promise<void> {
    await db
      .update(articles)
      .set({ status: status as 'draft' | 'published', updatedAt: new Date() })
      .where(
        and(
          eq(articles.id, id), eq(articles.userId, userId)
        )
      )
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await db
      .update(articles)
      .set({ status: 'deleted' })
      .where(
        and(
          eq(articles.id, id), eq(articles.userId, userId)
        )
      )
  }
}
