import { CertificateRepository } from '@module/certificate/repository/certificate.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Certificate, NewCertificate } from '@module/certificate/entity/certificate'
import { injectable } from 'tsyringe'
import { eq } from 'drizzle-orm'
import { certificates } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'

@injectable()
export class CertificateRepositoryImpl implements CertificateRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Certificate>> {
    const whereCondition = eq(certificates.userId, userId)
    return paginate(db, certificates, options, [], whereCondition)
  }

  async findById(id: string): Promise<Certificate | null> {
    const row = await db.query.certificates.findFirst({
      where: eq(certificates.id, id)
    })

    return row ?? null
  }

  async save(data: NewCertificate): Promise<Certificate> {
    const [inserted] = await db
      .insert(certificates)
      .values(data)
      .returning()

    return inserted
  }

  async setImage(id: string, key: string): Promise<void> {
    await db
      .update(certificates)
      .set({ certificateImage: key, updatedAt: new Date() })
      .where(eq(certificates.id, id))
  }

}
