import "reflect-metadata"
import {registerUserModule} from "@module/user/user.container"
import { registerAuthModule } from '@module/auth/auth.container'
import { container } from 'tsyringe'
import { EmailService } from '@core/service/email.service'
import { EmailServiceImpl } from '@core/service/email.service.impl'
import { registerWorkExperienceModule } from '@module/work-experience/work-experience.container'

export async function setupContainer() {
  container.register<EmailService>("EmailService", { useClass: EmailServiceImpl })

  await registerUserModule()
  await registerAuthModule()
  await registerWorkExperienceModule()
}
