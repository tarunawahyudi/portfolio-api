import { Education, NewEducation } from '@module/education/entity/education'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { UpdateEducationRequest } from '@module/education/dto/education.dto'

export interface EducationRepository {
  save(data: NewEducation): Promise<Education>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Education>>
  findById(id: string): Promise<Education | null>
  update(id: string, userId: string, data: UpdateEducationRequest): Promise<Education>
  delete(id: string, userId: string): Promise<Education>
}
