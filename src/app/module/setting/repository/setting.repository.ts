import { NewSetting, Setting } from '@module/setting/entity/setting'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface SettingRepository {
  save(userId, data: NewSetting): Promise<Setting>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Setting>>
  findById(id: number): Promise<Setting | null>
}
