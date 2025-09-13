import { container } from 'tsyringe'
import { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import { PortfolioControllerImpl } from '@module/portfolio/controller/portfolio.controller.impl'
import { PortfolioRepositoryImpl } from '@module/portfolio/repository/impl/portfolio.repository.impl'
import { PortfolioService } from '@module/portfolio/service/portfolio.service'
import { PortfolioServiceImpl } from '@module/portfolio/service/portfolio.service.impl'
import { PortfolioController } from '@module/portfolio/controller/portfolio.controller'
import { PortfolioGalleryRepositoryImpl } from '@module/portfolio/repository/impl/portfolio-gallery.repository.impl'
import { PortfolioGalleryRepository } from '@module/portfolio/repository/portfolio-gallery.repository'

export async function registerPortfolioModule() {
  container.register<PortfolioRepository>("PortfolioRepository", { useClass: PortfolioRepositoryImpl })
  container.register<PortfolioGalleryRepository>("PortfolioGalleryRepository", { useClass: PortfolioGalleryRepositoryImpl })
  container.register<PortfolioService>("PortfolioService", { useClass: PortfolioServiceImpl })
  container.register<PortfolioController>("PortfolioController", { useClass: PortfolioControllerImpl })
}
