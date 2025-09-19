import { Certificate, NewCertificate } from '@module/certificate/entity/certificate'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { UpdateCertificateRequest } from '@module/certificate/dto/certificate.dto'

export interface CertificateRepository {
  save(data: NewCertificate): Promise<Certificate>;
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Certificate>>;
  update(id: string, userId: string, data: UpdateCertificateRequest): Promise<Certificate>
  delete(id: string, userId: string): Promise<void>
  findByIdAndUser(id: string, userId: string): Promise<Certificate | null>
}
