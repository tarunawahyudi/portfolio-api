import { AwardResponse, CreateAwardRequest } from '@module/award/dto/award.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface AwardService {
  create(request: CreateAwardRequest): Promise<AwardResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<AwardResponse>>
  show(id: string): Promise<AwardResponse>
}
