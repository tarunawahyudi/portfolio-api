import { AwardService } from '@module/award/service/award.service'
import { AwardResponse, CreateAwardRequest } from '@module/award/dto/award.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { AwardRepository } from '@module/award/repository/award.repository'
import { NewAward } from '@module/award/entity/award'
import { toAwardResponse } from '@module/award/mapper/award.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AwardServiceImpl implements AwardService {
  constructor(
    @inject('AwardRepository') private readonly awardRepository: AwardRepository
  ) {}
  async create(request: CreateAwardRequest): Promise<AwardResponse> {
    const result = await this.awardRepository.save(request as NewAward)
    return toAwardResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<AwardResponse>> {
    const paginatedResult = await this.awardRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toAwardResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination,
    }
  }

  async show(id: string): Promise<AwardResponse> {
    const row = await this.awardRepository.findById(id)
    if (!row) throw new AppException('AWARD-001')
    return toAwardResponse(row)
  }

}
