import { SkillService } from '@module/skill/service/skill.service'
import { CreateSkillRequest, SkillResponse } from '@module/skill/dto/skill.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { SkillRepository } from '@module/skill/repository/skill.repository'
import { NewSkill } from '@module/skill/entity/skill'
import { toSkillResponse } from '@module/skill/mapper/skill.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class SkillServiceImpl implements SkillService {
  constructor(
    @inject('SkillRepository') private readonly skillRepository: SkillRepository
  ) {
  }
  async create(request: CreateSkillRequest): Promise<SkillResponse> {
    const result = await this.skillRepository.save(request as NewSkill)
    return toSkillResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<SkillResponse>> {
    const paginatedResult = await this.skillRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toSkillResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination,
    }
  }

  async show(id: string): Promise<SkillResponse> {
    const row = await this.skillRepository.findById(id)
    if (!row) throw new AppException('SKILL-001')
    return toSkillResponse(row)
  }

}
