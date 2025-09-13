import { container } from 'tsyringe'
import { CertificateRepository } from '@module/certificate/repository/certificate.repository'
import { CertificateRepositoryImpl } from '@module/certificate/repository/certificate.repository.impl'
import { CertificateService } from '@module/certificate/service/certificate.service'
import { CertificateServiceImpl } from '@module/certificate/service/certificate.service.impl'
import { CertificateControllerImpl } from '@module/certificate/controller/certificate.controller.impl'
import { CertificateController } from '@module/certificate/controller/certificate.controller'

export async function registerCertificateModule() {
  container.register<CertificateRepository>("CertificateRepository", { useClass: CertificateRepositoryImpl })
  container.register<CertificateService>("CertificateService", { useClass: CertificateServiceImpl })
  container.register<CertificateController>("CertificateController", { useClass: CertificateControllerImpl })
}
