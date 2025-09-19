import { AwardResponse, CreateAwardRequest, UpdateAwardRequest } from '@module/award/dto/award.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface AwardService {
  create(request: CreateAwardRequest): Promise<AwardResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<AwardResponse>>
  show(id: string, userId: string): Promise<AwardResponse>
  modify(id: string, userId: string, data: UpdateAwardRequest): Promise<AwardResponse>
  remove(id: string, userId: string): Promise<void>
  uploadImages(id: string, userId: string, files: File[]): Promise<AwardResponse>
  removeImage(id: string, userId: string, imageKey: string): Promise<AwardResponse>
}
