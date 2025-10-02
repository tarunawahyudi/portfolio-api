import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { certificates, users } from '@db/schema'

export type Certificate = InferSelectModel<typeof certificates>
export type NewCertificate = InferInsertModel<typeof certificates>

export type CertificateWithUser = Certificate & {
  user: InferSelectModel<typeof users>;
};
