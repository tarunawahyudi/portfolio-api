import { Skill } from '@module/skill/entity/skill'
import { SkillResponse } from '@module/skill/dto/skill.dto'

export function toSkillResponse(skill: Skill): SkillResponse {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category ?? '',
    proficiency: skill.proficiency,
  }
}
