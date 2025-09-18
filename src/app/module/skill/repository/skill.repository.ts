import { NewSkill, Skill } from '@module/skill/entity/skill'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { UpdateSkillRequest } from '@module/skill/dto/skill.dto'

export interface SkillRepository {
  save(data: NewSkill): Promise<Skill>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Skill>>
  update(id: string, userId: string, data: UpdateSkillRequest): Promise<Skill>
  findById(id: string): Promise<Skill | null>
  findByIdAndUser(id: string, userId: string): Promise<Skill | null>
  delete(id: string, userId: string): Promise<void>
}
