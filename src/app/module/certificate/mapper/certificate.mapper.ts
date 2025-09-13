import { Certificate } from '@module/certificate/entity/certificate'
import {
  CertificateResponse,
} from '@module/certificate/dto/certificate.dto'
import { cdnUrl } from '@shared/util/common.util'

export function toCertificateResponse(certificate: Certificate): CertificateResponse {
  return {
    id: certificate.id,
    title: certificate.title,
    organization: certificate.organization ?? '',
    issueDate: certificate.issueDate ?? '',
    expirationDate: certificate.expirationDate ?? '',
    certificateImage: cdnUrl(certificate.certificateImage) ?? '',
    credentialUrl: certificate.credentialUrl ?? '',
    credentialId: certificate.credentialId ?? '',
  }
}
