import { injectable } from 'tsyringe'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { extname } from 'path'
import { randomBytes } from 'crypto'
import { logger } from '@shared/util/logger.util'

@injectable()
export class StorageService {
  private s3: S3Client
  private readonly bucketName: string

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.replace('<ACCOUNT_ID>', process.env.R2_ACCOUNT_ID!),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }

  async upload(file: File, folder: string): Promise<{ key: string }> {
    const fileBuffer = await file.arrayBuffer()
    const fileExtension = extname(file.name)
    const uniqueFileName = `${randomBytes(16).toString('hex')}${fileExtension}`
    const key = `${folder}/${uniqueFileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type
    })

    await this.s3.send(command)
    logger.info(`[StorageService] File uploaded successfully to R2: ${key}`)
    return { key }
  }
}
