import { CertificateService } from '@module/certificate/service/certificate.service'
import { CertificateResponse, CreateCertificateRequest } from '@module/certificate/dto/certificate.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { CertificateRepository } from '@module/certificate/repository/certificate.repository'
import { NewCertificate } from '@module/certificate/entity/certificate'
import { toCertificateResponse } from '@module/certificate/mapper/certificate.mapper'
import { AppException } from '@core/exception/app.exception'
import { StorageService } from '@core/service/storage.service'
import { cdnUrl } from '@shared/util/common.util'
import { logger } from '@sentry/bun'

@injectable()
export class CertificateServiceImpl implements CertificateService {
  constructor(
    @inject('StorageService') private readonly storageService: StorageService,
    @inject('CertificateRepository') private readonly certificateRepository: CertificateRepository
  ) {}
  async create(request: CreateCertificateRequest): Promise<CertificateResponse> {
    const result = await this.certificateRepository.save(request as NewCertificate)
    return toCertificateResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CertificateResponse>> {
    const paginatedResult = await this.certificateRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toCertificateResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination,
    }
  }

  async show(id: string): Promise<CertificateResponse> {
    const row = await this.certificateRepository.findById(id)
    if (!row) throw new AppException('CERT-001')

    return toCertificateResponse(row)
  }

  async uploadCertificateImage(id: string, userId: string, image: File): Promise<{ imageUrl: string | null }> {
    const certificate = await this.certificateRepository.findOne(id, userId)
    if (!certificate) throw new AppException('CERT-001')

    const oldImageKey = certificate.certificateImage

    const { key: newImageKey } = await this.storageService.upload({
      file: image,
      module: 'certificate',
      collection: 'image'
    })

    try {
      await this.certificateRepository.setImage(id, newImageKey)
      if (oldImageKey) {
        logger.info(`Deleting old certificate image: ${oldImageKey}`)
        this.storageService.delete(oldImageKey).catch(err =>
          logger.error(`Failed to delete old image ${oldImageKey}`, err)
        )
      }
      return { imageUrl: cdnUrl(newImageKey) }
    } catch (dbError) {
      console.error(dbError)
      logger.error(`Database update failed. Rolling back storage upload for key: ${newImageKey}`)

      await this.storageService.delete(newImageKey).catch(err =>
        logger.error(`Failed to rollback (delete) new image ${newImageKey}`, err)
      )

      throw dbError
    }
  }
}
