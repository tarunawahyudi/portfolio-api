import "reflect-metadata"
import {registerUserModule} from "@module/user/user.container"
import { registerAuthModule } from '@module/auth/auth.container'
import { container } from 'tsyringe'
import { EmailService } from '@core/service/email.service'
import { EmailServiceImpl } from '@core/service/email.service.impl'

export async function setupContainer() {
  container.register<EmailService>("EmailService", { useClass: EmailServiceImpl })

  await registerUserModule()
  await registerAuthModule()
}
