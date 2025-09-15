import { Certificate, NewCertificate } from '@module/certificate/entity/certificate'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CertificateRepository {
  save(data: NewCertificate): Promise<Certificate>;
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Certificate>>;
  findById(id: string): Promise<Certificate | null>;
  findOne(id: string, userId: string): Promise<Certificate | null>;
  setImage(id: string, key: string): Promise<void>;
}
