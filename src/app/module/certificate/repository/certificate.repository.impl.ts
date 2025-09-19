import { injectable } from 'tsyringe'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { certificates } from '@db/schema'
import { Certificate, NewCertificate } from '@module/certificate/entity/certificate'
import { UpdateCertificateRequest } from '@module/certificate/dto/certificate.dto'
import { CertificateRepository } from '@module/certificate/repository/certificate.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { paginate } from '@shared/util/pagination.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CertificateRepositoryImpl implements CertificateRepository {
  async findAll(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<Certificate>> {
    const whereCondition = eq(certificates.userId, userId)
    return paginate(db, certificates, options, [
      certificates.title,
      certificates.organization
    ], whereCondition)
  }

  async findByIdAndUser(id: string, userId: string): Promise<Certificate | null> {
    const row = await db.query.certificates.findFirst({
      where: and(eq(certificates.id, id), eq(certificates.userId, userId)),
    })
    return row ?? null
  }

  async save(data: NewCertificate): Promise<Certificate> {
    const [inserted] = await db.insert(certificates).values(data).returning()
    return inserted
  }

  async update(id: string, userId: string, data: UpdateCertificateRequest): Promise<Certificate> {
    const [updated] = await db
      .update(certificates)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(certificates.id, id), eq(certificates.userId, userId)))
      .returning()
    if (!updated) throw new AppException('CERT-001', 'Certificate not found or access denied.')
    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db
      .delete(certificates)
      .where(and(eq(certificates.id, id), eq(certificates.userId, userId)))
  }
}
