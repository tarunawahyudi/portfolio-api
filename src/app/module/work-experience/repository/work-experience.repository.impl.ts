import { WorkExperienceRepository } from '@module/work-experience/repository/work-experience.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewWorkExperience, WorkExperience } from '@module/work-experience/entity/work-experience'
import { injectable } from 'tsyringe'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { workExperiences } from '@db/schema'
import { and, eq } from 'drizzle-orm'

@injectable()
export class WorkExperienceRepositoryImpl implements WorkExperienceRepository {
  async findAll(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>> {
    const whereCondition = eq(workExperiences.userId, userId)
    return paginate(db, workExperiences, options, [], whereCondition)
  }

  async findById(id: string): Promise<WorkExperience | null> {
    const row = await db.query.workExperiences.findFirst({
      where: eq(workExperiences.id, id),
    })

    return row || null
  }

  async save(data: NewWorkExperience): Promise<WorkExperience> {
    const [inserted] = await db
      .insert(workExperiences)
      .values(data)
      .returning()

    return inserted
  }

  async update(id: string, userId: string, data: Partial<NewWorkExperience>): Promise<WorkExperience> {
    const [updated] = await db
      .update(workExperiences)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(workExperiences.id, id),
          eq(workExperiences.userId, userId),
        )
      ).returning()

    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db
      .delete(workExperiences)
      .where(
        and(
          eq(workExperiences.id, id),
          eq(workExperiences.userId, userId)
        )
      )
      .returning()
  }
}
