import { CreateSkillRequest, SkillResponse, UpdateSkillRequest } from '@module/skill/dto/skill.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface SkillService {
  create(request: CreateSkillRequest): Promise<SkillResponse>;
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<SkillResponse>>
  show(id: string, userId: string): Promise<SkillResponse>
  modify(id: string, userId: string, data: UpdateSkillRequest): Promise<SkillResponse>
  remove(id: string, userId: string): Promise<void>
}
