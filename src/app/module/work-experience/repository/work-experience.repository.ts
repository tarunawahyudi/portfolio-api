import { NewWorkExperience, WorkExperience } from '@module/work-experience/entity/work-experience'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface WorkExperienceRepository {
  findAll(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>>
  findById(id: string): Promise<WorkExperience | null>
  save(data: NewWorkExperience): Promise<WorkExperience>;
  update(id: string, userId: string, data: Partial<NewWorkExperience>): Promise<WorkExperience>
  delete(id: string, userId: string): Promise<void>
}
