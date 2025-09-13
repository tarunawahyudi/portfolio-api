import { CreateEducationRequest, EducationResponse } from '@module/education/dto/education.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface EducationService {
  create(request: CreateEducationRequest): Promise<EducationResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<EducationResponse>>
  show(id: string): Promise<EducationResponse>
}
