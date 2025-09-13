import "reflect-metadata"
import {registerUserModule} from "@module/user/user.container"
import { registerAuthModule } from '@module/auth/auth.container'
import { container } from 'tsyringe'
import { EmailService } from '@core/service/email.service'
import { registerWorkExperienceModule } from '@module/work-experience/work-experience.container'
import { StorageService } from '@core/service/storage.service'
import { registerPortfolioModule } from '@module/portfolio/portfolio.container'
import { registerEducationModule } from '@module/education/education.container'

export async function setupContainer() {
  container.registerSingleton('EmailService', EmailService)
  container.registerSingleton('StorageService', StorageService)

  await registerUserModule()
  await registerAuthModule()
  await registerWorkExperienceModule()
  await registerPortfolioModule()
  await registerEducationModule()
}
