import { logger } from '@shared/util/logger.util'
import sharp from 'sharp'

/**
 * Loads an image from a URL, converts WebP to JPEG if needed, and returns it as a Base64 Data URL.
 */
export async function urlToBase64(url: string | undefined): Promise<string | undefined> {
  if (!url) return undefined

  try {
    const response = await fetch(url)

    if (!response.ok) {
      logger.error(`Failed to load image: HTTP Status ${response.status} for URL: ${url}`)
      return undefined
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    const arrayBuffer = await response.arrayBuffer()
    let imageBuffer: Buffer = Buffer.from(arrayBuffer)
    let finalContentType = contentType

    // CONVERSION STEP: If format is WebP, convert to JPEG.
    if (contentType.includes('image/webp')) {
      logger.info('Converting WebP to JPEG for PDF compatibility...')

      // Convert using Sharp: WebP Buffer -> JPEG Buffer
      imageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 80 }) // Convert to JPEG with quality 80
        .toBuffer()

      finalContentType = 'image/jpeg'
    }
    // Check for other supported image types (PNG/JPEG)
    else if (
      !finalContentType.startsWith('image/jpeg') &&
      !finalContentType.startsWith('image/png')
    ) {
      logger.warn(`Content type ${finalContentType} is not supported. Failed to process image.`)
      return undefined
    }

    // Return a guaranteed compatible Data URL (JPEG/PNG)
    const base64 = imageBuffer.toString('base64')
    return `data:${finalContentType};base64,${base64}`
  } catch (error) {
    logger.error(`Error while fetching/converting image with Sharp: ${error}`)
    return undefined
  }
}
