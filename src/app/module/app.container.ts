import "reflect-metadata"
import {registerUserModule} from "@module/user/user.container"
import { registerAuthModule } from '@module/auth/auth.container'
import { container } from 'tsyringe'
import { EmailService } from '@core/service/email.service'
import { registerWorkExperienceModule } from '@module/work-experience/work-experience.container'
import { StorageService } from '@core/service/storage.service'
import { registerPortfolioModule } from '@module/portfolio/portfolio.container'
import { registerEducationModule } from '@module/education/education.container'
import { registerCertificateModule } from '@module/certificate/certificate.container'
import { registerSkillModule } from '@module/skill/skill.container'
import { registerAwardModule } from '@module/award/award.container'
import { registerTestimonialModule } from '@module/testimonial/testimonial.container'
import { registerCourseModule } from '@module/course/course.container'

export async function setupContainer() {
  container.registerSingleton('EmailService', EmailService)
  container.registerSingleton('StorageService', StorageService)

  await registerUserModule()
  await registerAuthModule()
  await registerWorkExperienceModule()
  await registerPortfolioModule()
  await registerEducationModule()
  await registerCertificateModule()
  await registerSkillModule()
  await registerAwardModule()
  await registerTestimonialModule()
  await registerCourseModule()
}
