import { injectable, inject } from 'tsyringe'
import { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import { StorageService } from '@core/service/storage.service'
import { AppException } from '@core/exception/app.exception'
import { MediaService } from '@module/media/service/media.service'
import { MediaRepository } from '@module/media/repository/media.repository'
import { MediaResponse } from '@module/media/dto/media.dto'
import { toMediaResponse } from '@module/media/mapper/dto.mapper'

@injectable()
export class MediaServiceImpl implements MediaService {
  constructor(
    @inject('MediaRepository') private readonly mediaRepo: MediaRepository,
    @inject('PortfolioRepository') private readonly portfolioRepo: PortfolioRepository,
    @inject('StorageService') private readonly storageService: StorageService,
  ) {}

  async uploadForPortfolio(
    portfolioId: string,
    file: File,
  ): Promise<MediaResponse> {
    const portfolio = await this.portfolioRepo.findById(portfolioId)
    if (!portfolio) {
      throw new AppException('PORTFOLIO-404', 'Portfolio not found or permission denied.')
    }

    const { key } = await this.storageService.upload({
      file: file,
      module: 'portfolio',
      category: 'gallery',
    })

    const newMedia = await this.mediaRepo.create({
      fileKey: key,
      fileType: file.type,
      fileSize: file.size,
      ownerId: portfolioId,
      ownerType: 'portfolio',
    })

    return toMediaResponse(newMedia)
  }

  async remove(mediaId: string, userId: string): Promise<{ message: string }> {
    const deletedMedia = await this.mediaRepo.delete(mediaId, userId, 'portfolio')
    if (!deletedMedia) {
      throw new AppException('MEDIA-404', 'Media not found or permission denied.')
    }
    await this.storageService.delete(deletedMedia.fileKey)

    return { message: 'Media deleted successfully.' }
  }
}
