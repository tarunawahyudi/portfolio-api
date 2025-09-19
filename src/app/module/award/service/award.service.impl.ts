import { injectable, inject } from 'tsyringe'
import { AwardService } from '@module/award/service/award.service'
import type { AwardRepository } from '@module/award/repository/award.repository'
import { StorageService } from '@core/service/storage.service'
import { CreateAwardRequest, UpdateAwardRequest, AwardResponse } from '@module/award/dto/award.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewAward } from '@module/award/entity/award'
import { toAwardResponse } from '@module/award/mapper/award.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class AwardServiceImpl implements AwardService {
  constructor(
    @inject('AwardRepository') private readonly awardRepository: AwardRepository,
    @inject('StorageService') private readonly storageService: StorageService,
  ) {}

  private async findAndValidate(id: string, userId: string) {
    const record = await this.awardRepository.findByIdAndUser(id, userId)
    if (!record) throw new AppException('AWARD-001')
    return record
  }

  async fetch(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<AwardResponse>> {
    const result = await this.awardRepository.findAll(userId, options)
    return { data: result.data.map(toAwardResponse), pagination: result.pagination }
  }

  async show(id: string, userId: string): Promise<AwardResponse> {
    const record = await this.findAndValidate(id, userId)
    return toAwardResponse(record)
  }

  async create(request: CreateAwardRequest): Promise<AwardResponse> {
    const result = await this.awardRepository.save(request as NewAward)
    return toAwardResponse(result)
  }

  async modify(id: string, userId: string, data: UpdateAwardRequest): Promise<AwardResponse> {
    await this.findAndValidate(id, userId)
    const updated = await this.awardRepository.update(id, userId, data)
    return toAwardResponse(updated)
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findAndValidate(id, userId)
    if (record.images && record.images.length > 0) {
      await this.storageService.deleteMany(record.images)
    }
    await this.awardRepository.delete(id, userId)
  }

  async uploadImages(id: string, userId: string, files: File[]): Promise<AwardResponse> {
    await this.findAndValidate(id, userId)
    const uploadPromises = files.map((file) =>
      this.storageService.upload({
        file,
        module: 'award',
        collection: 'gallery',
      }),
    )
    const uploadResults = await Promise.all(uploadPromises)
    const imageKeys = uploadResults.map((result) => result.key)
    const updated = await this.awardRepository.addImages(id, imageKeys)
    return toAwardResponse(updated)
  }

  async removeImage(id: string, userId: string, imageKey: string): Promise<AwardResponse> {
    const record = await this.findAndValidate(id, userId)
    if (!record.images?.includes(imageKey))
      throw new AppException('AWARD-002')

    await this.storageService.delete(imageKey)
    const updated = await this.awardRepository.removeImage(id, imageKey)
    return toAwardResponse(updated)
  }
}
