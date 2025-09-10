import { WorkExperienceService } from '@module/work-experience/service/work-experience.service'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { WorkExperience } from '@module/work-experience/entity/work-experience'
import { inject, injectable } from 'tsyringe'
import type { WorkExperienceRepository } from '@module/work-experience/repository/work-experience.repository'
import { CreateWorkExperienceRequest } from '@module/work-experience/dto/work-experience.dto'

@injectable()
export class WorkExperienceServiceImpl implements WorkExperienceService {
  constructor(
    @inject('WorkExperienceRepository') private readonly workExperienceRepository: WorkExperienceRepository
  ) {}

  async fetch(options: PaginationOptions, userId: string): Promise<PaginatedResponse<WorkExperience>> {
    return this.workExperienceRepository.findAll(options, userId)
  }

  async create(request: CreateWorkExperienceRequest): Promise<WorkExperience> {
    return await this.workExperienceRepository.save(request)
  }
}
