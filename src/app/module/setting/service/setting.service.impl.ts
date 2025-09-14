import { SettingService } from '@module/setting/service/setting.service'
import { CreateSettingRequest, SettingResponse } from '@module/setting/dto/setting.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { SettingRepository } from '@module/setting/repository/setting.repository'
import { NewSetting } from '@module/setting/entity/setting'
import { toSettingResponse } from '@module/setting/mapper/setting.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class SettingServiceImpl implements SettingService {
  constructor(
    @inject('SettingRepository') private settingRepository: SettingRepository,
  ) {}
  async create(userId: string, request: CreateSettingRequest): Promise<SettingResponse> {
    const result = await this.settingRepository.save(userId, request as NewSetting)
    return toSettingResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<SettingResponse>> {
    const paginatedResult = await this.settingRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toSettingResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination
    }
  }

  async show(id: number): Promise<SettingResponse> {
    const row = await this.settingRepository.findById(id)
    if (!row) throw new AppException('SETTING-001')
    return toSettingResponse(row)
  }
}
