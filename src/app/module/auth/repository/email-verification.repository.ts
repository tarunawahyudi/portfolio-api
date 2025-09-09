import { EmailVerification, NewEmailVerification } from '@module/auth/entity/email-verification'

export interface EmailVerificationRepository {
  save(data: NewEmailVerification): Promise<void>;
  findLatestValid(userId: string): Promise<EmailVerification | null>
  markUsed(id: number): Promise<void>
}
