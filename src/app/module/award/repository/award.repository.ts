import { Award, NewAward } from '@module/award/entity/award'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { UpdateAwardRequest } from '@module/award/dto/award.dto'

export interface AwardRepository {
  save(data: NewAward): Promise<Award>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Award>>
  findByIdAndUser(id: string, userId: string): Promise<Award | null>
  update(id: string, userId: string, data: UpdateAwardRequest): Promise<Award>
  delete(id: string, userId: string): Promise<void>
  addImages(id: string, imageKeys: string[]): Promise<Award>
  removeImage(id: string, imageKey: string): Promise<Award>
}
