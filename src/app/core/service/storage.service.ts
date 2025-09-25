import { injectable } from 'tsyringe'
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import path from 'path'
import { randomBytes } from 'crypto'
import { logger } from '@shared/util/logger.util'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface UploadOptions {
  file?: File
  buffer?: Buffer
  fileName?: string
  mimeType?: string
  module: string
  collection: string
}

@injectable()
export class StorageService {
  private readonly s3: S3Client
  private readonly bucketName: string

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.replace(
        '<ACCOUNT_ID>',
        process.env.R2_ACCOUNT_ID!,
      ),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }

  async upload(options: UploadOptions): Promise<{ key: string }> {
    const { file, buffer, module, collection } = options

    let fileBuffer: Buffer
    let fileType: string
    let fileName: string

    if (buffer) {
      fileBuffer = buffer
      fileType = options.mimeType!
      fileName = options.fileName!
    } else if (file) {
      fileBuffer = Buffer.from(await file.arrayBuffer())
      fileType = file.type
      const fileExtension = path.extname(file.name)
      fileName = `${randomBytes(16).toString('hex')}${fileExtension}`
    } else {
      throw new Error("Either 'file' or 'buffer' must be provided for upload.")
    }

    const key = `${module}/${collection}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: fileType,
    })

    await this.s3.send(command)
    logger.info(`[StorageService] File uploaded successfully to R2: ${key}`)
    return { key }
  }

  async delete(key: string): Promise<void> {
    if (!key) {
      logger.warn('[StorageService] Delete operation skipped: key is null or empty.')
      return
    }
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.s3.send(command)
    logger.info(`[StorageService] File deleted successfully from R2: ${key}`)
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (!keys || keys.length === 0) {
      logger.warn('[StorageService] DeleteMany operation skipped: keys array is empty.')
      return
    }

    const objectsToDelete = keys.map((key) => ({ Key: key }))

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: objectsToDelete,
      },
    })

    await this.s3.send(command)
    logger.info(`[StorageService] ${keys.length} files deleted successfully from R2.`)
  }

  async getPresignedUrl(key: string, expiresIn: number = 900): Promise<string> {
    if (!key) {
      throw new Error('Cannot generate presigned URL for an empty key.')
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    return getSignedUrl(this.s3, command, { expiresIn })
  }
}
