import { CreateSettingRequest, SettingResponse } from '@module/setting/dto/setting.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface SettingService {
  create(userId, request: CreateSettingRequest): Promise<SettingResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<SettingResponse>>
  show(id: number): Promise<SettingResponse>
}
