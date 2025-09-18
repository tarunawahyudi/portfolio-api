import {
  CreateEducationRequest,
  EducationResponse,
  UpdateEducationRequest,
} from '@module/education/dto/education.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface EducationService {
  create(request: CreateEducationRequest): Promise<EducationResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<EducationResponse>>
  show(id: string, userId: string): Promise<EducationResponse>
  modify(id: string, userId: string, data: UpdateEducationRequest): Promise<EducationResponse>
  remove(id: string, userId: string): Promise<void>
}
