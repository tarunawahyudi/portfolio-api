import { CreateSkillRequest, SkillResponse } from '@module/skill/dto/skill.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface SkillService {
  create(request: CreateSkillRequest): Promise<SkillResponse>;
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<SkillResponse>>
  show(id: string): Promise<SkillResponse>;
}
