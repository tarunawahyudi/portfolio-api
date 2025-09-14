import { Award, NewAward } from '@module/award/entity/award'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface AwardRepository {
  save(data: NewAward): Promise<Award>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Award>>
  findById(id: string): Promise<Award | null>
}
