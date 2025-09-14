import { container } from 'tsyringe'
import { ArticleRepository } from '@module/article/repository/article.repository'
import { ArticleService } from '@module/article/service/article.service'
import { ArticleController } from '@module/article/controller/article.controller'
import { ArticleRepositoryImpl } from '@module/article/repository/article.repository.impl'
import { ArticleServiceImpl } from '@module/article/service/article.service.impl'
import { ArticleControllerImpl } from '@module/article/controller/article.controller.impl'

export async function registerArticleModule() {
  container.register<ArticleRepository>("ArticleRepository", { useClass: ArticleRepositoryImpl })
  container.register<ArticleService>("ArticleService", { useClass: ArticleServiceImpl })
  container.register<ArticleController>("ArticleController", { useClass: ArticleControllerImpl })
}
