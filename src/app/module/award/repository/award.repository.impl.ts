import { injectable } from 'tsyringe'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@db/index'
import { awards } from '@db/schema'
import { Award, NewAward } from '@module/award/entity/award'
import { UpdateAwardRequest } from '@module/award/dto/award.dto'
import { AwardRepository } from '@module/award/repository/award.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { paginate } from '@shared/util/pagination.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AwardRepositoryImpl implements AwardRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Award>> {
    const whereConditions = eq(awards.userId, userId)
    return paginate(db, awards, options, [awards.title], whereConditions)
  }

  async findByIdAndUser(id: string, userId: string): Promise<Award | null> {
    const row = await db.query.awards.findFirst({
      where: and(eq(awards.id, id), eq(awards.userId, userId)),
    })
    return row ?? null
  }

  async save(data: NewAward): Promise<Award> {
    const [inserted] = await db.insert(awards).values(data).returning()
    return inserted
  }

  async update(id: string, userId: string, data: UpdateAwardRequest): Promise<Award> {
    const [updated] = await db
      .update(awards)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(awards.id, id), eq(awards.userId, userId)))
      .returning()
    if (!updated) throw new AppException('AWARD-001', 'Award not found or access denied.')
    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.delete(awards).where(and(eq(awards.id, id), eq(awards.userId, userId)))
  }

  async addImages(id: string, imageKeys: string[]): Promise<Award> {
    const [updated] = await db
      .update(awards)
      .set({ images: sql`array_cat(${awards.images}, ARRAY[${imageKeys}])` })
      .where(eq(awards.id, id))
      .returning()
    return updated
  }

  async removeImage(id: string, imageKey: string): Promise<Award> {
    const [updated] = await db
      .update(awards)
      .set({ images: sql`array_remove(${awards.images}, ${imageKey})` })
      .where(eq(awards.id, id))
      .returning()
    return updated
  }
}
