import { EducationRepository } from '@module/education/repository/education.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Education, NewEducation } from '@module/education/entity/education'
import { db } from '@db/index'
import { educations } from '@db/schema'
import { eq } from 'drizzle-orm'
import { paginate } from '@shared/util/pagination.util'
import { injectable } from 'tsyringe'

@injectable()
export class EducationRepositoryImpl implements EducationRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Education>> {
    const whereCondition = eq(educations.userId, userId)
    return paginate(db, educations, options, [], whereCondition)
  }

  async findById(id: string): Promise<Education | null> {
    const row = await db.query.educations.findFirst({
      where: eq(educations.id, id)
    })

    return row ?? null
  }

  async save(data: NewEducation): Promise<Education> {
    const [inserted] = await db
      .insert(educations)
      .values(data)
      .returning()

    return inserted
  }

}
