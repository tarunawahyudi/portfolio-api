import { SkillRepository } from '@module/skill/repository/skill.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewSkill, Skill } from '@module/skill/entity/skill'
import { eq } from 'drizzle-orm'
import { skills } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'

export class SkillRepositoryImpl implements SkillRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Skill>> {
    const whereCondition = eq(skills.userId, userId)
    return paginate(db, skills, options, [], whereCondition)
  }

  async findById(id: string): Promise<Skill | null> {
    const row = await db.query.skills.findFirst({
      where: eq(skills.id, id),
    })

    return row ?? null
  }

  async save(data: NewSkill): Promise<Skill> {
    const [inserted] = await db
      .insert(skills)
      .values(data)
      .returning()

    return inserted
  }

}
