import {
  CertificateResponse,
  CreateCertificateRequest,
} from '@module/certificate/dto/certificate.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CertificateService {
  create(request: CreateCertificateRequest): Promise<CertificateResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CertificateResponse>>
  show(id: string): Promise<CertificateResponse>
  uploadCertificateImage(id: string, image: File): Promise<{ imageUrl: string | null }>
}
