import { SkillRepository } from '@module/skill/repository/skill.repository';
import { PaginatedResponse, PaginationOptions } from '@shared/type/global';
import { NewSkill, Skill } from '@module/skill/entity/skill';
import { injectable } from 'tsyringe';
import { paginate } from '@shared/util/pagination.util';
import { db } from '@db/index';
import { skills } from '@db/schema';
import { and, eq } from 'drizzle-orm';
import { UpdateSkillRequest } from '@module/skill/dto/skill.dto';
import { AppException } from '@core/exception/app.exception';

@injectable()
export class SkillRepositoryImpl implements SkillRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Skill>> {
    const whereCondition = eq(skills.userId, userId)
    return paginate(db, skills, options, [], whereCondition)
  }

  async findById(id: string): Promise<Skill | null> {
    const row = await db.query.skills.findFirst({ where: eq(skills.id, id) })
    return row ?? null
  }

  async findByIdAndUser(id: string, userId: string): Promise<Skill | null> {
    const row = await db.query.skills.findFirst({
      where: and(eq(skills.id, id), eq(skills.userId, userId)),
    })
    return row ?? null
  }

  async save(data: NewSkill): Promise<Skill> {
    const [inserted] = await db.insert(skills).values(data).returning()
    return inserted
  }

  async update(id: string, userId: string, data: UpdateSkillRequest): Promise<Skill> {
    const [updated] = await db
      .update(skills)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(skills.id, id), eq(skills.userId, userId)))
      .returning()
    if (!updated) throw new AppException('SKILL-001', 'Skill not found or access denied.')
    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.delete(skills).where(and(eq(skills.id, id), eq(skills.userId, userId)))
  }
}
