import { injectable } from 'tsyringe'
import { EmailVerificationRepository } from '@module/auth/repository/email-verification.repository'
import { EmailVerification, NewEmailVerification } from '@module/auth/entity/email-verification'
import { db } from '@db/index'
import { emailVerification } from '@db/schema'
import { and, desc, eq, gt } from 'drizzle-orm'
import { getDbOrTx } from '@shared/decorator/transactional.decorator'

@injectable()
export class EmailVerificationRepositoryImpl implements EmailVerificationRepository {
  async findLatestValid(userId: number): Promise<EmailVerification | null> {
    const now = new Date()

    const dbOrTx = getDbOrTx()
    const rows = await dbOrTx
      .select()
      .from(emailVerification)
      .where(
        and(
          eq(emailVerification.userId, userId),
          eq(emailVerification.used, false),
          gt(emailVerification.expiresAt, now),
        ),
      )
      .orderBy(desc(emailVerification.createdAt))
      .limit(1)

    return rows[0] ?? null
  }

  async save(data: NewEmailVerification): Promise<void> {
    await db.insert(emailVerification).values(data)
  }

  async markUsed(id: number): Promise<void> {
    const dbOrTx = getDbOrTx()
    await dbOrTx
      .update(emailVerification)
      .set({
        used: true,
        updatedAt: new Date(),
      })
      .where(eq(emailVerification.id, id))
  }
}
