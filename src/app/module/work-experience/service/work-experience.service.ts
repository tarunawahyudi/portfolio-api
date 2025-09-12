import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { WorkExperience } from '@module/work-experience/entity/work-experience'
import {
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest, WorkExperienceResponse,
} from '@module/work-experience/dto/work-experience.dto'

export interface WorkExperienceService {
  fetch(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperienceResponse>>
  create(request: CreateWorkExperienceRequest): Promise<WorkExperience>
  modify(id: string, userId: string, request: UpdateWorkExperienceRequest): Promise<void>
  remove(id: string, userId: string): Promise<void>
}
