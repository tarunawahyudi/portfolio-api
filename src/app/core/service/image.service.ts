import { injectable } from 'tsyringe'
import sharp from 'sharp'
import { randomBytes } from 'crypto'

interface ImageProcessingOptions {
  format?: 'webp' | 'avif' | 'jpeg'
  quality?: number
  resize?: {
    width?: number
    height?: number
  }
}

interface ProcessedImage {
  buffer: Buffer
  fileName: string
  mimeType: string
}

@injectable()
export class ImageService {
  public async processUpload(
    file: File,
    options: ImageProcessingOptions = {},
  ): Promise<ProcessedImage> {
    const format = options.format || 'webp'
    const quality = options.quality || 80
    const resizeOptions = options.resize

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    let imageProcessor = sharp(inputBuffer)

    if (resizeOptions) {
      imageProcessor = imageProcessor.resize({
        width: resizeOptions.width,
        height: resizeOptions.height,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    switch (format) {
      case 'avif':
        imageProcessor = imageProcessor.avif({ quality: quality - 20 })
        break
      case 'jpeg':
        imageProcessor = imageProcessor.jpeg({ quality: quality, mozjpeg: true })
        break
      case 'webp':
      default:
        imageProcessor = imageProcessor.webp({ quality: quality })
        break
    }

    const outputBuffer = await imageProcessor.toBuffer()
    const uniqueHash = randomBytes(16).toString('hex')
    const newFileName = `${uniqueHash}.${format}`

    return {
      buffer: outputBuffer,
      fileName: newFileName,
      mimeType: `image/${format}`,
    }
  }
}
