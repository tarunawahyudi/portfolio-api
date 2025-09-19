import {
  CertificateResponse,
  CreateCertificateRequest,
  UpdateCertificateRequest,
} from '@module/certificate/dto/certificate.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CertificateService {
  create(request: CreateCertificateRequest): Promise<CertificateResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CertificateResponse>>
  show(id: string, userId: string): Promise<CertificateResponse>
  uploadCertificateImage(id: string, userId: string, image: File): Promise<{ imageUrl: string | null }>
  uploadDisplayImage(id: string, userId: string, image: File): Promise<{ display: any }>
  modify(id: string, userId: string, data: UpdateCertificateRequest): Promise<CertificateResponse>
  remove(id: string, userId: string): Promise<void>
}
