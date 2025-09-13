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

  async uploadCertificateImage(id: string, image: File): Promise<{ imageUrl: string | null }> {
    const certificate = await this.certificateRepository.findById(id)
    if (!certificate) throw new AppException('CERT-001')

    const { key} = await this.storageService.upload({
      file: image,
      module: 'certificate',
      collection: 'image'
    })

    await this.certificateRepository.setImage(id, key)
    return { imageUrl: cdnUrl(key) }
  }
}
