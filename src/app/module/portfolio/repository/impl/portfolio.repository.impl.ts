import { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import {
  NewPortfolio,
  Portfolio,
  PortfolioWithGallery,
  PortfolioWithRelations,
} from '@module/portfolio/entity/portfolio'
import { portfolios, portfolioViews } from '@db/schema'
import { and, count, eq } from 'drizzle-orm'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { injectable } from 'tsyringe'
import { NewPortfolioView } from '@module/portfolio/entity/portfolio-view'

@injectable()
export class PortfolioRepositoryImpl implements PortfolioRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Portfolio>> {
    const whereCondition = eq(portfolios.userId, userId)
    return paginate(db, portfolios, options, [portfolios.title, portfolios.category], whereCondition)
  }

  async save(data: NewPortfolio): Promise<Portfolio> {
    const [inserted] = await db
      .insert(portfolios)
      .values(data)
      .returning()

    return inserted
  }

  async findById(id: string): Promise<Portfolio | null> {
    const row = await db.query.portfolios.findFirst({
      where: eq(portfolios.id, id)
    })

    return row || null
  }

  async findDetail(id: string): Promise<PortfolioWithRelations | null> {
    const row = await db.query.portfolios.findFirst({
      where: eq(portfolios.id, id),
      with: {
        gallery: true,
        user: true,
      }
    })

    if (!row) return null

    const [{ total }] = await db
      .select({ total: count() })
      .from(portfolioViews)
      .where(eq(portfolioViews.portfolioId, id))

    return {
      ...row,
      viewCount: total ?? 0,
    }
  }

  async findOne(id: string, userId: string): Promise<Portfolio | null> {
    const row = await db.query.portfolios.findFirst({
      where: and(
        eq(portfolios.id, id),
        eq(portfolios.userId, userId)
      )
    })

    return row || null
  }

  async update(id: string, userId: string, data: NewPortfolio): Promise<Portfolio> {
    const [updated] = await db
      .update(portfolios)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(portfolios.id, id),
          eq(portfolios.userId, userId)
        )
      ).returning()

    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db
      .delete(portfolios)
      .where(
        and(
          eq(portfolios.id, id),
          eq(portfolios.userId, userId)
        )
      )
  }

  async updateThumbnail(id: string, userId: string, thumbnailKey: string): Promise<Portfolio> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set({ thumbnail: thumbnailKey, updatedAt: new Date() })
      .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId)))
      .returning()

    return updatedPortfolio
  }

  async findByIdWithGallery(id: string, userId: string): Promise<PortfolioWithGallery | undefined> {
    return db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, id), eq(portfolios.userId, userId)),
      with: {
        gallery: true,
      },
    })
  }

  async logView(data: NewPortfolioView): Promise<void> {
    await db.insert(portfolioViews).values(data)
  }
}
