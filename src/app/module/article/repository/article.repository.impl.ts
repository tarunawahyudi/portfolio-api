import { injectable } from 'tsyringe'
import { and, eq, not, SQL } from 'drizzle-orm'
import { articles } from '@db/schema'
import { ArticleRepository } from '@module/article/repository/article.repository'
import { UpdateArticleRequest, ArticleStatus } from '@module/article/dto/article.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { AppException } from '@core/exception/app.exception'
import {
  Article,
  ArticleWithAuthor,
  NewArticle,
} from '@module/article/entity/article'

@injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  async findAll(
    userId: string,
    options: PaginationOptions,
    status?: ArticleStatus,
  ): Promise<PaginatedResponse<Article>> {
    const conditions: (SQL | undefined)[] = [eq(articles.userId, userId)]

    if (status) {
      conditions.push(eq(articles.status, status))
    } else {
      conditions.push(not(eq(articles.status, 'deleted')))
    }

    const searchColumns = [articles.title, articles.content]

    return paginate(
      db,
      articles,
      options,
      searchColumns,
      and(...conditions.filter((c): c is SQL => !!c)),
    )
  }

  async findByIdAndUser(id: string, userId: string): Promise<Article | null> {
    const row = await db.query.articles.findFirst({
      where: and(eq(articles.id, id), eq(articles.userId, userId)),
    })
    return row ?? null
  }

  async save(data: NewArticle): Promise<Article> {
    const [inserted] = await db.insert(articles).values(data).returning()
    return inserted
  }

  async update(id: string, userId: string, data: UpdateArticleRequest): Promise<Article> {
    const [updated] = await db
      .update(articles)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()
    if (!updated) throw new AppException('ARTICLE-001')
    return updated
  }

  async updateStatus(id: string, userId: string, status: ArticleStatus): Promise<Article> {
    const extraData = status === 'published' ? { publishedAt: new Date() } : {}
    const [updated] = await db
      .update(articles)
      .set({ status, ...extraData, updatedAt: new Date() })
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()
    if (!updated) throw new AppException('ARTICLE-001')
    return updated
  }

  async updateThumbnail(id: string, userId: string, thumbnailUrl: string | null): Promise<Article> {
    const [updated] = await db
      .update(articles)
      .set({ thumbnail: thumbnailUrl, updatedAt: new Date() })
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()
    if (!updated) throw new AppException('ARTICLE-001')
    return updated
  }

  async findPublicBySlug(slug: string): Promise<ArticleWithAuthor | null> {
    const row = await db.query.articles.findFirst({
      where: and(eq(articles.slug, slug), eq(articles.status, 'published')),
      with: {
        user: { with: { profile: true } },
      },
    })
    return row ?? null
  }
}
