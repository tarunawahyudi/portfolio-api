import { NewSkill, Skill } from '@module/skill/entity/skill'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface SkillRepository {
  save(data: NewSkill): Promise<Skill>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Skill>>
  findById(id: string): Promise<Skill | null>
}
