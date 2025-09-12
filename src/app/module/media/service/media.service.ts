import { MediaResponse } from '@module/media/dto/media.dto'

export interface MediaService {
  uploadForPortfolio(portfolioId: string, file: File): Promise<MediaResponse>
  remove(mediaId: string, userId: string): Promise<{ message: string }>
}
