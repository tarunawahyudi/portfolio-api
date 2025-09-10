import { NewWorkExperience, WorkExperience } from '@module/work-experience/entity/work-experience'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface WorkExperienceRepository {
  findAll(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>>;
  save(data: NewWorkExperience): Promise<WorkExperience>;
}
