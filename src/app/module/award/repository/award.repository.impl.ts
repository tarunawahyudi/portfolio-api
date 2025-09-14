import { AwardRepository } from '@module/award/repository/award.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Award, NewAward } from '@module/award/entity/award'
import { eq } from 'drizzle-orm'
import { awards } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { injectable } from 'tsyringe'

@injectable()
export class AwardRepositoryImpl implements AwardRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Award>> {
    const whereConditions = eq(awards.userId, userId)
    return paginate(db, awards, options, [], whereConditions)
  }

  async findById(id: string): Promise<Award | null> {
    const row = await db.query.awards.findFirst({
      where: eq(awards.id, id)
    })

    return row ?? null
  }

  async save(data: NewAward): Promise<Award> {
    const [inserted] = await db
      .insert(awards)
      .values(data)
      .returning()

    return inserted
  }

}
