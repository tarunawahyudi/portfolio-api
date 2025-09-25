import { injectable, inject } from 'tsyringe'
import { CertificateService } from '@module/certificate/service/certificate.service'
import type { CertificateRepository } from '@module/certificate/repository/certificate.repository'
import { StorageService } from '@core/service/storage.service'
import {
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CertificateResponse,
} from '@module/certificate/dto/certificate.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewCertificate } from '@module/certificate/entity/certificate'
import { toCertificateResponse } from '@module/certificate/mapper/certificate.mapper'
import { AppException } from '@core/exception/app.exception'
import { cdnUrl } from '@shared/util/common.util'
import { logger } from '@shared/util/logger.util'
import { ImageService } from '@core/service/image.service'

@injectable()
export class CertificateServiceImpl implements CertificateService {
  constructor(
    @inject('ImageService') private readonly imageService: ImageService,
    @inject('StorageService') private readonly storageService: StorageService,
    @inject('CertificateRepository') private readonly certificateRepository: CertificateRepository,
  ) {}

  private async findAndValidate(id: string, userId: string) {
    const record = await this.certificateRepository.findByIdAndUser(id, userId)
    if (!record) {
      throw new AppException('CERT-001')
    }
    return record
  }

  async fetch(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<CertificateResponse>> {
    const result = await this.certificateRepository.findAll(userId, options)
    return { data: result.data.map(toCertificateResponse), pagination: result.pagination }
  }

  async show(id: string, userId: string): Promise<CertificateResponse> {
    const record = await this.findAndValidate(id, userId)
    return toCertificateResponse(record)
  }

  async create(request: CreateCertificateRequest): Promise<CertificateResponse> {
    const result = await this.certificateRepository.save(request as NewCertificate)
    return toCertificateResponse(result)
  }

  async modify(
    id: string,
    userId: string,
    data: UpdateCertificateRequest,
  ): Promise<CertificateResponse> {
    await this.findAndValidate(id, userId)
    const updated = await this.certificateRepository.update(id, userId, data)
    return toCertificateResponse(updated)
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findAndValidate(id, userId)
    const keysToDelete: string[] = []
    if (record.certificateImage) {
      keysToDelete.push(record.certificateImage)
    }
    if (record.display.type === 'upload' && record.display.value) {
      keysToDelete.push(record.display.value)
    }

    if (keysToDelete.length > 0) {
      await this.storageService.deleteMany(keysToDelete)
    }

    await this.certificateRepository.delete(id, userId)
  }

  async uploadCertificateImage(
    id: string,
    userId: string,
    image: File,
  ): Promise<{ imageUrl: string | null }> {
    const record = await this.findAndValidate(id, userId)
    if (record.certificateImage) {
      this.storageService
        .delete(record.certificateImage)
        .catch((err) => logger.error(`Failed to delete old certificate image: ${err}`))
    }

    const processedImage = await this.imageService.processUpload(image, {
      format: 'webp',
      quality: 90,
      resize: { width: 1920 },
    })

    const { key: newImageKey } = await this.storageService.upload({
      buffer: processedImage.buffer,
      fileName: processedImage.fileName,
      mimeType: processedImage.mimeType,
      module: 'certificate',
      collection: 'image',
    })

    await this.certificateRepository.update(id, userId, { certificateImage: newImageKey })

    return { imageUrl: cdnUrl(newImageKey) }
  }

  async uploadDisplayImage(id: string, userId: string, image: File): Promise<{ display: any }> {
    const record = await this.findAndValidate(id, userId)
    if (record.display.type === 'upload' && record.display.value) {
      this.storageService
        .delete(record.display.value)
        .catch((err) => logger.error(`Failed to delete old display image: ${err}`))
    }

    const processedImage = await this.imageService.processUpload(image, {
      format: 'webp',
      quality: 80,
      resize: { width: 600 },
    })

    const { key: newImageKey } = await this.storageService.upload({
      buffer: processedImage.buffer,
      fileName: processedImage.fileName,
      mimeType: processedImage.mimeType,
      module: 'certificate',
      collection: 'display',
    })

    const newDisplay = { type: 'upload' as const, value: newImageKey }
    const updated = await this.certificateRepository.update(id, userId, { display: newDisplay })

    return { display: toCertificateResponse(updated).display }
  }
}
