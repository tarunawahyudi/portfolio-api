import { Education, NewEducation } from '@module/education/entity/education'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface EducationRepository {
  save(data: NewEducation): Promise<Education>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Education>>
  findById(id: string): Promise<Education | null>
}
