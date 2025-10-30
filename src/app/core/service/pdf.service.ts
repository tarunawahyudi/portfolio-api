import { injectable } from 'tsyringe'
import { logger } from '@shared/util/logger.util'
import { renderCVToBuffer } from '@shared/util/pdf-render.util'
import { urlToBase64 } from '@shared/util/file.util'

@injectable()
export class PdfService {
  async generateCv(data: any): Promise<Buffer> {
    try {
      logger.info('Generating PDF')

      if (data.profile.avatarUrl) {
        data.profile.avatarUrl = await urlToBase64(data.profile.avatarUrl)
      }

      const pdfBuffer = await renderCVToBuffer(data)

      logger.info('PDF generated successfully')
      return Buffer.from(pdfBuffer)
    } catch (error) {
      logger.error(`Failed to create PDF with: ${error}`)
      throw new Error('Failed creation PDF')
    }
  }
}
