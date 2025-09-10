import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { WorkExperience } from '@module/work-experience/entity/work-experience'
import { CreateWorkExperienceRequest } from '@module/work-experience/dto/work-experience.dto'

export interface WorkExperienceService {
  fetch(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>>
  create(request: CreateWorkExperienceRequest): Promise<WorkExperience>
}
