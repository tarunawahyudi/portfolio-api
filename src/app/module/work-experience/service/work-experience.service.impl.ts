import { WorkExperienceService } from '@module/work-experience/service/work-experience.service'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { WorkExperience } from '@module/work-experience/entity/work-experience'
import { inject, injectable } from 'tsyringe'
import type { WorkExperienceRepository } from '@module/work-experience/repository/work-experience.repository'
import {
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest, WorkExperienceResponse,
} from '@module/work-experience/dto/work-experience.dto'
import { AppException } from '@core/exception/app.exception'
import { toWorkExperienceResponse } from '@module/work-experience/mapper/work-experience.mapper'

@injectable()
export class WorkExperienceServiceImpl implements WorkExperienceService {
  constructor(
    @inject('WorkExperienceRepository') private readonly workExperienceRepository: WorkExperienceRepository
  ) {}

  private async validate(id: string): Promise<void> {
    const exists = await this.workExperienceRepository.findById(id)
    if (!exists) throw new AppException('WE-001')
  }

  async fetch(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperienceResponse>> {
    const paginatedResult = await this.workExperienceRepository.findAll(options, userId)
    const transformData = paginatedResult.data.map(toWorkExperienceResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination
    }
  }

  async create(request: CreateWorkExperienceRequest): Promise<WorkExperience> {
    return await this.workExperienceRepository.save(request)
  }

  async modify(id: string, userId: string, request: UpdateWorkExperienceRequest): Promise<void> {
    await this.validate(id)
    await this.workExperienceRepository.update(id, userId, request)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.validate(id)
    await this.workExperienceRepository.delete(id, userId)
  }
}
