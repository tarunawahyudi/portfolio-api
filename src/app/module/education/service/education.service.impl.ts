import { EducationService } from '@module/education/service/education.service'
import {
  CreateEducationRequest,
  EducationResponse,
  UpdateEducationRequest,
} from '@module/education/dto/education.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewEducation } from '@module/education/entity/education'
import { inject, injectable } from 'tsyringe'
import type { EducationRepository } from '@module/education/repository/education.repository'
import { toEducationResponse } from '@module/education/mapper/education.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class EducationServiceImpl implements EducationService {
  constructor(
    @inject('EducationRepository') private readonly educationRepository: EducationRepository
  ) {}
  async create(request: CreateEducationRequest): Promise<EducationResponse> {
    const result = await this.educationRepository.save(request as NewEducation)
    return toEducationResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<EducationResponse>> {
    const paginatedResult = await this.educationRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toEducationResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination
    }
  }

  async show(id: string, userId: string): Promise<EducationResponse> {
    const row = await this.educationRepository.findByIdAndUser(id, userId)
    if (!row) throw new AppException('EDU-001')
    return toEducationResponse(row)
  }

  async modify(id: string, userId: string, data: UpdateEducationRequest): Promise<EducationResponse> {
    const existingRecord = await this.educationRepository.findByIdAndUser(id, userId)
    if (!existingRecord) throw new AppException('EDU-001')

    const updatedEducation = await this.educationRepository.update(id, userId, data)
    return toEducationResponse(updatedEducation)
  }

  async remove(id: string, userId: string): Promise<void> {
    const existingRecord = await this.educationRepository.findByIdAndUser(id, userId)
    if (!existingRecord) throw new AppException('EDU-001')
    await this.educationRepository.delete(id, userId)
  }
}
