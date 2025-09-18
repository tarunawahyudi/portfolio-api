import { EducationRepository } from '@module/education/repository/education.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Education, NewEducation } from '@module/education/entity/education'
import { db } from '@db/index'
import { educations } from '@db/schema'
import { and, eq } from 'drizzle-orm'
import { paginate } from '@shared/util/pagination.util'
import { injectable } from 'tsyringe'
import { UpdateEducationRequest } from '@module/education/dto/education.dto'
import { AppException } from '@core/exception/app.exception'

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

  async update(id: string, userId: string, data: UpdateEducationRequest): Promise<Education> {
    const [updated] = await db
      .update(educations)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(educations.id, id), eq(educations.userId, userId)))
      .returning()

    if (!updated) {
      throw new AppException('EDU-001', 'Education record not found or permission denied.')
    }

    return updated
  }

  async delete(id: string, userId: string): Promise<Education> {
    const [deleted] = await db
      .delete(educations)
      .where(and(eq(educations.id, id), eq(educations.userId, userId)))
      .returning()

    if (!deleted) {
      throw new AppException('EDU-001', 'Education record not found or permission denied.')
    }

    return deleted
  }

  async findByIdAndUser(id: string, userId: string): Promise<Education | null> {
    const row = await db.query.educations.findFirst({
      where: and(eq(educations.id, id), eq(educations.userId, userId)),
    })
    return row ?? null
  }
}
