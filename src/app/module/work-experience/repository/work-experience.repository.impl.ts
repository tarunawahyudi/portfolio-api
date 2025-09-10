import { WorkExperienceRepository } from '@module/work-experience/repository/work-experience.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewWorkExperience, WorkExperience } from '@module/work-experience/entity/work-experience'
import { injectable } from 'tsyringe'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { workExperiences } from '@db/schema'
import { eq } from 'drizzle-orm'

@injectable()
export class WorkExperienceRepositoryImpl implements WorkExperienceRepository {
  async findAll(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>> {
    const whereCondition = eq(workExperiences.userId, userId)
    return paginate(db, workExperiences, options, [], whereCondition)
  }

  async save(data: NewWorkExperience): Promise<WorkExperience> {
    const [inserted] = await db
      .insert(workExperiences)
      .values(data)
      .returning()

    return inserted
  }
}
